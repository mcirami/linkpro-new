export default function InputLabel({ value, className = '', children = null, ...props }) {
    return (
        <label {...props} className={`block ` + className}>
            {value ? value : children || ""}
        </label>
    );
}
