type InputType = "text" | "number" | "time";

interface InputConfigProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (val: T) => void;
  type: InputType;
}

export default function InputConfig<T extends string | number>({
  label,
  value,
  onChange,
  type,
}: InputConfigProps<T>) {
  return (
    <div>
      <label className="block text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const newValue = type === "number" ? Number(e.target.value) : e.target.value;
          onChange(newValue as T); // coerção segura
        }}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
    </div>
  );
}
