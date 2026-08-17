import React, {useEffect, useState, useRef} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';
import {VscTriangleDown} from 'react-icons/vsc';

// ---------------------------------------------------------
// helpers: RGBA <-> strings + HEX display
// ---------------------------------------------------------
const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(Number(n) || 0)));
const toHex2 = (n) => clamp255(n).toString(16).padStart(2, '0');
export const rgbaToString = ({r, g, b, a = 1}) => `rgba(${clamp255(r)} , ${clamp255(g)} , ${clamp255(b)} , ${Math.max(0, Math.min(1, Number(a)))})`;
export const hex6FromRGB = ({ r, g, b }) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toUpperCase();
export const hex8FromRGBA = ({ r, g, b, a = 1 }) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2((Number(a) ?? 1) * 255)}`.toUpperCase();
export function parseRGBA(str) {
    if (!str) return { r: 0, g: 0, b: 0, a: 1 };
    const m = String(str).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d\.]+))?\s*\)/i);
    if (!m) return { r: 0, g: 0, b: 0, a: 1 };
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] != null ? Number(m[4]) : 1 };
}

// ---------------------------------------------------------
// viewport-safe placer
// ---------------------------------------------------------
function placePopover({ anchorRect, popEl, prefer = 'above', gutter = 12, pad = 8, sidebar = { enabled: true, minWidth: 350, breakpoint: 768 } }) {
    if (!popEl || !anchorRect) return 'above';

    // Measure popover (fallback sizes)
    const pw = popEl.offsetWidth || popEl.getBoundingClientRect().width || 300;
    const ph = popEl.offsetHeight || popEl.getBoundingClientRect().height || 420; // SketchPicker approx height
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal center by default
    let left = (anchorRect.left + anchorRect.right) / 2 - pw / 2;

    // Try above first
    let top = anchorRect.top - ph - gutter;
    let placement = 'above';

    // If off the top or prefer below, flip below when possible
    if (prefer === 'below' || top < pad) {
        const belowTop = anchorRect.bottom + gutter;
        if (belowTop + ph + pad <= vh) {
            top = belowTop;
            placement = 'below';
        } else {
            // Neither fully fits; choose the larger available space then clamp
            const spaceAbove = anchorRect.top - gutter - pad;
            const spaceBelow = vh - (anchorRect.bottom + gutter) - pad;
            if (spaceBelow >= spaceAbove) {
                top = anchorRect.bottom + gutter;
                placement = 'below';
            } else {
                top = Math.max(pad, anchorRect.top - ph - gutter);
                placement = 'above';
            }
        }
    }

    // Account for a fixed left sidebar on wide screens
    const leftGuard = (vw > sidebar.breakpoint && sidebar.enabled) ? (sidebar.minWidth + pad) : pad;

    // Clamp to viewport bounds respecting sidebar
    left = Math.max(leftGuard, Math.min(left, vw - pw - pad));
    top  = Math.max(pad, Math.min(top,  vh - ph - pad));

    // Apply fixed coordinates
    Object.assign(popEl.style, { position: 'fixed', left: `${left}px`, top: `${top}px` });
    popEl.setAttribute('data-placement', placement);
    return placement;
}

/**
 * Presentational color picker: swatch + viewport-safe SketchPicker popover.
 *
 * Owns nothing but the open/closed state and the in-flight color. The consumer
 * decides where the value comes from and what saving means:
 *   initialValue - rgba string the picker opens on
 *   onChange     - fired on every drag with the rgba string (live preview)
 *   onSave       - fired on Save; return a promise to keep the popover open
 *                  until the request resolves
 *   onCancel     - fired on close with the rgba string to revert to
 */
const ColorPickerBase = ({
                             label,
                             initialValue = null,
                             fallback = 'rgba(0,0,0,1)',
                             onChange = null,
                             onSave = null,
                             onCancel = null,
                         }) => {
    // color state kept as rgba object for alpha slider
    const [sketchPickerColor, setSketchPickerColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
    const { r, g, b, a } = sketchPickerColor;

    const [showPicker, setShowPicker] = useState(false);
    const [pickerBg, setPickerBg] = useState({});
    const [colorValues, setColorValues] = useState({ previous: null, current: null, hex: null });
    const [placement, setPlacement] = useState('above');

    // What Close reverts to. Held separately from colorValues.previous so a
    // column that started out unset goes back to unset rather than to the
    // fallback the swatch had to display.
    const revertValueRef = useRef(initialValue ?? null);

    // reflect rgba to swatch background
    useEffect(() => {
        setPickerBg({ background: rgbaToString(sketchPickerColor) });
    }, [sketchPickerColor]);

    // Init from props on mount only. onChange feeds a live preview back up to
    // the consumer, so re-running this when initialValue changes would reset
    // the revert-to value mid-drag. Remount with a `key` to re-initialise
    // against a different record.
    useEffect(() => {
        const parsed = parseRGBA(initialValue || fallback);
        setSketchPickerColor(parsed);
        setPickerBg({ background: rgbaToString(parsed) });
        setColorValues({ previous: rgbaToString(parsed), current: rgbaToString(parsed), hex: hex6FromRGB(parsed) });
    }, []);

    // close on scroll/resize
    useEffect(() => {
        const close = () => setShowPicker(false);
        window.addEventListener('scroll', close);
        window.addEventListener('resize', close);
        return () => { window.removeEventListener('scroll', close); window.removeEventListener('resize', close); };
    }, []);

    // position popover when open + on scroll/resize
    const pickerContainerRef = useRef(null);   // wraps the popover
    const triggerRef = useRef(null);           // the colored swatch link
    const updatePosition = () => {
        const trigger = triggerRef.current;
        const pop = pickerContainerRef.current?.querySelector('.picker_wrapper');
        if (!trigger || !pop) return;
        const rect = trigger.getBoundingClientRect();
        const place = placePopover({ anchorRect: rect, popEl: pop, gutter: 10, pad: 8 });
        setPlacement(place);
    };
    useEffect(() => {
        if (!showPicker) return;
        const id = requestAnimationFrame(updatePosition); // wait for paint
        const onScroll = () => updatePosition();
        const onResize = () => updatePosition();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(id); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
    }, [showPicker]);

    const handleOnChange = (color) => {
        const rgba = color.rgb; // { r,g,b,a }
        setSketchPickerColor(rgba);
        const value = rgbaToString(rgba);

        onChange?.(value);

        setColorValues((prev) => ({ ...prev, current: value, hex: (rgba.a == null || rgba.a === 1) ? hex6FromRGB(rgba) : hex8FromRGBA(rgba) }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        Promise.resolve(onSave?.(colorValues.current)).then((res) => {
            // A consumer that returns nothing is treated as a success.
            if (res === false) return;
            revertValueRef.current = colorValues.current;
            setColorValues((p) => ({ ...p, previous: p.current }));
            setShowPicker(false);
        });
    };

    const handleClose = (e) => {
        e.preventDefault();
        // revert UI & state
        const revertTo = revertValueRef.current;
        const parsed = parseRGBA(revertTo || fallback);
        setSketchPickerColor(parsed);
        setPickerBg({ background: rgbaToString(parsed) });
        setColorValues((p) => ({ ...p, current: p.previous }));

        onCancel?.(revertTo);

        setShowPicker(false);
    };

    const handleTriggerClick = (e) => {
        e.preventDefault();
        setShowPicker((open) => !open);
    };

    // what we show under the label
    const displayHex = Number(a) === 1 ? hex6FromRGB({ r, g, b }) : hex8FromRGBA({ r, g, b, a });

    return (
        <button className="w-full transform-none group rounded-xl p-4 text-left shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424fcf]/30 bg-white hover:shadow-lg">
            <div className="icon_wrap flex justify-start gap-2 w-full min-w-0">
                <a ref={triggerRef} href="#" onClick={handleTriggerClick}>
                    <span className="color_box" style={pickerBg} />
                </a>

                <div ref={pickerContainerRef} className="picker_container">
                    {showPicker && (
                        <div className="picker_wrapper relative rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200 p-3" data-placement={placement}>
                            <div className="close_icon icon_wrap absolute right-2 top-2 text-neutral-500">
                                <a href="#" onClick={handleClose}><RiCloseCircleFill /></a>
                            </div>

                            <SketchPicker color={sketchPickerColor} onChange={handleOnChange} width={300} />

                            <div className="mt-3 flex items-center gap-2">
                                <a className="button blue" href="#" onClick={handleSave}>Save</a>
                                <code className="text-xs text-neutral-600">{displayHex}</code>
                            </div>

                            {/* Arrow: default down (used when popover is above the trigger). Flip via [data-placement] in CSS. */}
                            <div className={`picker_triangle absolute left-1/2 -translate-x-1/2 ${placement==='above' ? 'bottom-[-12px] rotate-180' : 'top-[-12px]'}`}>
                                <VscTriangleDown className="text-indigo-200" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <label>{label}</label>
                    <p className="text-sm text-gray-600 font-mono truncate">{displayHex}</p>
                </div>
            </div>
        </button>
    );
};

export default ColorPickerBase;
