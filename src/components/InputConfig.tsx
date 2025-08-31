type InputType = "text" | "number" | "time";

interface InputConfigProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (val: T) => void;
  type: InputType;
  placeholder?: string;
  description?: string;
  error?: string;
}

export default function InputConfig<T extends string | number>({
  label,
  value,
  onChange,
  type,
  placeholder,
  description,
  error,
}: InputConfigProps<T>) {
  return (
    <div className="w-full mb-4">
      <label className="block mb-1 text-[15px] font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const newValue =
            type === "number" ? Number(e.target.value) : e.target.value;
          onChange(newValue as T);
        }}
        className={`w-full rounded-xl border px-4 py-2 text-sm shadow-sm transition-colors focus:outline-none
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          }`}
      />

      {description && !error && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
