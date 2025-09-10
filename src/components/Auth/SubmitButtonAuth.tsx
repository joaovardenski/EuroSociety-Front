import { LogIn, Send, UserPlus } from "lucide-react";

interface SubmitButtonAuthProps {
  label: string;
  icon?: "login" | "register" | "send";
  onClick?: (e: React.FormEvent) => void;
  disabled?: boolean;
  loading?: boolean; // novo prop opcional
}

export default function SubmitButtonAuth({ label, icon, onClick, disabled, loading }: SubmitButtonAuthProps) {
  const renderIcon = () => {
    if (loading) return null; // ocultar ícone durante loading
    switch (icon) {
      case "register":
        return <UserPlus size={20} />;
      case "send":
        return <Send size={20} />;
      default:
        return <LogIn size={20} />;
    }
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      className={`w-full mt-2 bg-blue-500 text-white font-semibold p-3 rounded-md shadow-md flex items-center justify-center gap-2 transition-colors ${
        disabled ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
      }`}
      disabled={disabled}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Entrando...
        </>
      ) : (
        <>
          {renderIcon()}
          {label}
        </>
      )}
    </button>
  );
}
