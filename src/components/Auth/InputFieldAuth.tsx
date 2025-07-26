import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldAuthProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export default function InputFieldAuth({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error = "",
  disabled,
}: InputFieldAuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 relative">
      <label htmlFor={id} className="text-white font-semibold md:text-gray-600">
        {label}
      </label>
      <input
        type={inputType}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 rounded-md outline-0 border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-azulClaro md:bg-gray-200 md:border-2 pr-10`}
        disabled={disabled}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[40px] text-gray-600 hover:text-gray-800"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}
