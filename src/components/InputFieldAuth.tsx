// components/InputField.tsx
interface InputFieldAuthProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export default function InputFieldAuth({
  id,
  label,
  type = "text",
  placeholder = "",
}: InputFieldAuthProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-white font-semibold">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full p-2 rounded-md border border-gray-300 bg-azulClaro"
      />
    </div>
  );
}
