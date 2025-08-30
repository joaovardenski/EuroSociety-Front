import { XCircle, CheckCircle } from "lucide-react";

interface AlertMessageProps {
  message: string;
  type: "error" | "success";
}

export default function AlertMessage({ message, type }: AlertMessageProps) {
  const colors =
    type === "error"
      ? "text-red-700 bg-red-100 border border-red-300"
      : "text-green-700 bg-green-100 border border-green-300";

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-md p-2 text-center mt-2 w-full ${colors}`}
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {type === "error" ? <XCircle size={20} /> : <CheckCircle size={20} />}
      <span>{message}</span>
    </div>
  );
}
