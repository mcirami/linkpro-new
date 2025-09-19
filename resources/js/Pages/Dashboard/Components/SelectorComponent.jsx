import { useMemo, useCallback } from "react";

export default function SelectorComponent({
                                              value,
                                              onChange,
                                              commit,
                                              options,
                                              size = null,
                                              color = "border-indigo-600 bg-indigo-50",
}) {
    const idx = useMemo(
        () => Math.max(0, options.findIndex(o => o.value === value)),
        [options, value]
    );
    const colW = `${100 / options.length}%`;

    const onKeyDown = useCallback((e) => {
        if (!["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) return;
        e.preventDefault();
        let next = idx;
        if (e.key === "ArrowLeft")  next = (idx - 1 + options.length) % options.length;
        if (e.key === "ArrowRight") next = (idx + 1) % options.length;
        if (e.key === "Home")       next = 0;
        if (e.key === "End")        next = options.length - 1;
        onChange?.(options[next].value);
    }, [idx, options, onChange]);

    return (
        <div
            role="tablist"
            aria-label="Segmented control"
            className={`animated_tabs relative inline-flex w-full ${size} rounded-lg bg-white shadow-md overflow-hidden`}
            onKeyDown={onKeyDown}
        >
            {/* Sliding pill */}
            <span
                aria-hidden="true"
                className={` ${color} pointer-events-none absolute inset-y-0 left-0 rounded-lg shadow transition-transform duration-300 ease-out`}
                style={{
                    width: colW,
                    transform: `translateX(${idx * 100}%)`,
                    /*backgroundColor: color,*/
                }}
            />

            {options.map((opt, i) => {
                const selected = i === idx;
                return (
                    <a
                        href="#"
                        key={opt.value}
                        role="tab"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        className={[
                            "relative z-10 flex-1 px-4 py-2 text-sm font-semibold text-center",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#424fcf]/30 focus-visible:ring-offset-white",
                            "text-gray-800"
                        ].join(" ")}
                        onClick={(e) => commit(e, opt.value)}
                    >
                        {opt.label}
                    </a>
                );
            })}
        </div>
    );
}
