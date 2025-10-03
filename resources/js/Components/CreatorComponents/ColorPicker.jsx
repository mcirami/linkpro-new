import React, {useEffect, useState, useRef} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';
import {VscTriangleDown} from 'react-icons/vsc';

// KEEP your imports
import {
    updateData,
    updateSectionData,
} from '@/Services/CourseRequests.jsx';
import {
    updateData as updateLPData,
    updateSectionData as updateLPSectionData,
} from '@/Services/LandingPageRequests.jsx';
import {LP_ACTIONS} from '@/Components/Reducers/CreatorReducers.jsx';

// ---------------------------------------------------------
// helpers: RGBA <-> strings + HEX display
// ---------------------------------------------------------
const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(Number(n) || 0)));
const toHex2 = (n) => clamp255(n).toString(16).padStart(2, '0');
const rgbaToString = ({r, g, b, a = 1}) => `rgba(${clamp255(r)} , ${clamp255(g)} , ${clamp255(b)} , ${Math.max(0, Math.min(1, Number(a)))})`;
const hex6FromRGB = ({ r, g, b }) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toUpperCase();
const hex8FromRGBA = ({ r, g, b, a = 1 }) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2((Number(a) ?? 1) * 255)}`.toUpperCase();
function parseRGBA(str) {
    if (!str) return { r: 0, g: 0, b: 0, a: 1 };
    const m = String(str).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d\.]+))?\s*\)/i);
    if (!m) return { r: 0, g: 0, b: 0, a: 1 };
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] != null ? Number(m[4]) : 1 };
}

// ---------------------------------------------------------
// viewport-safe placer
// ---------------------------------------------------------
function f(n, min, max){ return Math.max(min, Math.min(max, n)); }
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

const ColorPicker = ({
                         label,
                         elementName,
                         data = null,
                         dispatch = null,
                         sections = null,
                         setSections = null,
                         currentSection = null,
                         saveTo
                     }) => {
    // color state kept as rgba object for alpha slider
    const [sketchPickerColor, setSketchPickerColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
    const { r, g, b, a } = sketchPickerColor;

    const [showPicker, setShowPicker] = useState(false);
    const [pickerBg, setPickerBg] = useState({});
    const [colorValues, setColorValues] = useState({ previous: null, current: null, hex: null });
    const [placement, setPlacement] = useState('above');

    // reflect rgba to swatch background
    useEffect(() => {
        setPickerBg({ background: rgbaToString(sketchPickerColor) });
    }, [sketchPickerColor]);

    // init from props
    useEffect(() => {
        let color;
        if (currentSection) {
            if (elementName === 'title_color' && !currentSection[elementName]) color = 'rgba(0,0,0,1)';
            else if (elementName === 'bg_color' && !currentSection[elementName]) color = 'rgba(255,255,255,1)';
            else color = currentSection[elementName];
        } else { color = data?.[elementName]; }

        const parsed = parseRGBA(color);
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

        if (sections) {
            setSections(sections.map((section) => (section.id === currentSection.id ? { ...section, [`${elementName}`]: value } : section)));
        } else {
            dispatch?.({ type: LP_ACTIONS.UPDATE_PAGE_DATA, payload: { value, name: elementName } });
        }

        setColorValues((prev) => ({ ...prev, current: value, hex: (rgba.a == null || rgba.a === 1) ? hex6FromRGB(rgba) : hex8FromRGBA(rgba) }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const packets = { [`${elementName}`]: colorValues.current };
        if (sections) {
            const method = saveTo === 'course' ? updateSectionData(packets, currentSection.id) : updateLPSectionData(packets, currentSection.id);
            method.then((res) => { if (res?.success) { setColorValues((p) => ({ ...p, previous: p.current })); setShowPicker(false); } });
        } else {
            const method = saveTo === 'course' ? updateData(packets, data.id, elementName) : updateLPData(packets, data.id, elementName);
            method.then((res) => { if (res?.success) { setColorValues((p) => ({ ...p, previous: p.current })); setShowPicker(false); } });
        }
    };

    const handleClose = (e) => {
        e.preventDefault();
        // revert UI & state
        const parsed = parseRGBA(colorValues.previous);
        setSketchPickerColor(parsed);
        setPickerBg({ background: colorValues.previous });

        if (sections) {
            setSections(sections.map((section) => (section.id === currentSection.id ? { ...section, [`${elementName}`]: colorValues.previous } : section)));
        } else {
            dispatch?.({ type: LP_ACTIONS.UPDATE_PAGE_DATA, payload: { value: colorValues.previous, name: elementName } });
        }

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

export default ColorPicker;
