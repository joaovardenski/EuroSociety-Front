import { LogIn, Send, UserPlus } from "lucide-react";

interface SubmitButtonAuthProps {
  label: string;
  icon?: "login" | "register" | "send";
  onClick?: (e:React.FormEvent) => void;
}

export default function SubmitButtonAuth({ label, icon, onClick }: SubmitButtonAuthProps) {
  const renderIcon = () => {
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
      className="w-full mt-2 bg-blue-500 text-white font-semibold p-3 rounded-md shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
    >
      {renderIcon()}
      {label}
    </button>
  );
}
