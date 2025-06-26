export default function PrimaryButton({ className = '', disabled, children = null, ...props }) {
    return (
        <button
            {...props}
            className={
                `font-bold inline-flex items-center button blue transition ease-in-out duration-150 ${
                    disabled ? 'opacity-25' : ""
                } ` + className
            }
            disabled={disabled}
        >
            {children || "Submit"}
        </button>
    );
}
