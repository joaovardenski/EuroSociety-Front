import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import InputFieldAuth from "../../components/Auth/InputFieldAuth";
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
// Utils
import { getSenhaRedefinicaoError } from "../../utils/Validators";
// Axios
import axiosPublic from "../../api/axiosPublic";
import { AxiosError } from "axios";
// Icons
import { CheckCircle, XCircle } from "lucide-react";

interface AlertState {
  message: string;
  type: "success" | "error";
}

interface ResetPasswordResponse {
  message?: string;
}

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
    {alert.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
    <span>{alert.message}</span>
  </div>
);

export default function ChangePassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Limpar alert após 5 segundos
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 5000);
    return () => clearTimeout(timer);
  }, [alert]);

  const validatePasswords = useCallback(() => {
    if (!token) return "Token inválido ou não encontrado na URL.";
    const validationError = getSenhaRedefinicaoError(senha.trim(), confirmacaoSenha.trim());
    return validationError || "";
  }, [senha, confirmacaoSenha, token]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAlert(null);

      const validationError = validatePasswords();
      if (validationError) {
        setAlert({ message: validationError, type: "error" });
        return;
      }

      setLoading(true);
      try {
        const response = await axiosPublic.post<ResetPasswordResponse>("/reset-password", {
          token,
          password: senha.trim(),
          password_confirmation: confirmacaoSenha.trim(),
        });

        setAlert({ message: response.data.message || "Senha redefinida com sucesso!", type: "success" });
        setSenha("");
        setConfirmacaoSenha("");

        // Redireciona após 2s
        const timer = setTimeout(() => navigate("/"), 2000);
        return () => clearTimeout(timer);
      } catch (error) {
        const axiosError = error as AxiosError<ResetPasswordResponse & { errors?: Record<string, string[]> }>;
        const msg =
          axiosError.response?.data?.errors
            ? Object.values(axiosError.response.data.errors).flat().join("\n")
            : axiosError.response?.data?.message || "Erro ao redefinir senha";
        setAlert({ message: msg, type: "error" });
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    },
    [senha, confirmacaoSenha, token, navigate, validatePasswords]
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
            <h1 className="text-white text-3xl font-semibold">Redefinir Senha</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">REDEFINIR SENHA</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Digite sua nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              error={alert?.type === "error" ? alert.message : undefined}
            />
            <InputFieldAuth
              id="iconfirmacaosenha"
              label="Confirme sua senha:"
              type="password"
              placeholder="Confirme a senha"
              value={confirmacaoSenha}
              onChange={(e) => setConfirmacaoSenha(e.target.value)}
            />
            <SubmitButtonAuth
              label={loading ? "Redefinindo..." : "Confirmar redefinição"}
              icon="send"
              disabled={loading}
            />
          </form>

          {alert && <AlertMessage alert={alert} />}

          {!alert && (
            <p className="text-white text-[15px] text-center font-semibold md:text-gray-700">
              Crie uma nova senha para sua conta
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
