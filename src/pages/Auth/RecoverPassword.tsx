import { useState, useEffect, useCallback } from "react";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import InputFieldAuth from "../../components/Auth/InputFieldAuth";
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
// Utils
import { getEmailRedefinicaoError } from "../../utils/Validators";
// Axios
import axiosPublic from "../../api/axiosPublic";
import { AxiosError } from "axios";
// Icons
import { CheckCircle, XCircle } from "lucide-react";

// --- Tipagens ---
interface AlertState {
  message: string;
  type: "success" | "error";
}

// --- Componentes pequenos ---
const AlertMessage = ({ alert }: { alert: AlertState }) => (
  <div
    className={`flex items-center justify-center gap-2 rounded-md p-2 text-center mt-2 w-full ${
      alert.type === "success"
        ? "text-green-700 bg-green-100 border border-green-300"
        : "text-red-700 bg-red-100 border border-red-300"
    }`}
    role="alert"
    aria-live={alert.type === "success" ? "polite" : "assertive"}
  >
    {alert.type === "success" ? <CheckCircle size={25} /> : <XCircle size={20} />}
    <span>{alert.message}</span>
  </div>
);

// --- Componente principal ---
export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Limpar alert após 5 segundos
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 5000);
    return () => clearTimeout(timer);
  }, [alert]);

  const validateEmail = useCallback((email: string) => {
    const error = getEmailRedefinicaoError(email.trim());
    if (error) return error;
    return "";
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAlert(null);

      const trimmedEmail = email.trim();
      const validationError = validateEmail(trimmedEmail);
      if (validationError) {
        setAlert({ message: validationError, type: "error" });
        return;
      }

      setLoading(true);
      try {
        const response = await axiosPublic.post("/forgot-password", { email: trimmedEmail });
        setAlert({ message: response.data.message || "Link de recuperação enviado com sucesso!", type: "success" });
        setEmail("");
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
        const msg =
          axiosError.response?.data?.errors
            ? Object.values(axiosError.response.data.errors).flat().join("\n")
            : axiosError.response?.data?.message || "Erro ao enviar link de recuperação";
        setAlert({ message: msg, type: "error" });
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    },
    [email, validateEmail]
  );

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-azulBase to-roxo md:bg-none md:bg-[#e1e6f9]">
      <div className="w-full max-w-md px-4 flex flex-col gap-6 md:max-w-5xl md:flex-row md:rounded-2xl md:px-0 md:mx-6 md:overflow-hidden md:shadow-2xl md:bg-white">
        {/* Lado esquerdo */}
        <div className="hidden md:flex w-1/2 bg-azulBase rounded-l-2xl items-center justify-center p-8">
          <img src={euroLogoWhite} alt="Logo da Euro Society" className="max-w-[90%] h-auto" />
        </div>

        {/* Formulário */}
        <div className="w-full md:w-1/2 flex flex-col items-center gap-6 py-10 md:py-16 px-6">
          <div className="flex flex-col items-center gap-3 md:hidden">
            <img src={euroLogoWhite} alt="Logo da Euro Society" style={{ height: "calc(100vh / 4)" }} />
            <h1 className="text-white text-3xl font-semibold">Recuperar Senha</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">RECUPERAR SENHA</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SubmitButtonAuth
              label={loading ? "Enviando..." : "Enviar link de recuperação"}
              icon="send"
              disabled={loading}
              loading={loading}
            />
          </form>

          {alert && <AlertMessage alert={alert} />}

          {!alert && (
            <p className="text-white text-[15px] text-center font-semibold md:text-gray-700">
              Um link de recuperação será enviado no seu endereço de email
            </p>
          )}

          <div className="text-center text-white text-sm md:text-gray-700">
            <p className="mt-2">
              <a href="/" className="text-blue-300 md:text-blue-500 hover:underline">
                Voltar para o Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
