import { useState } from "react";
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

interface ResetPasswordResponse {
  message?: string;
}

function ChangePassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>(); // pega o token da URL
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedSenha = senha.trim();
    const trimmedConfirmacaoSenha = confirmacaoSenha.trim();

    const senhaValidation = getSenhaRedefinicaoError(trimmedSenha, trimmedConfirmacaoSenha);
    setSenhaError(senhaValidation);
    setSuccessMessage("");

    if (senhaValidation) return;
    if (!token) {
      setSenhaError("Token inválido ou não encontrado na URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosPublic.post<ResetPasswordResponse>("/reset-password", {
        token: token,
        password: trimmedSenha,
        password_confirmation: trimmedConfirmacaoSenha, // necessário por causa do 'confirmed' no back
      });

      setSuccessMessage(response.data.message || "Senha redefinida com sucesso!");
      setSenha("");
      setConfirmacaoSenha("");

      // redireciona para login após 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ResetPasswordResponse & { errors?: Record<string, string[]> }>;
      if (axiosError.response && axiosError.response.data) {
        const data = axiosError.response.data;
        const msg = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Erro ao redefinir senha";
        setSenhaError(msg);
        console.error("Erro na requisição:", data);
      } else {
        setSenhaError("Erro de conexão com o servidor");
        console.error("Erro de rede:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-azulBase to-roxo md:bg-none md:bg-[#e1e6f9]">
      <div className="w-full max-w-md px-4 flex flex-col gap-6 md:max-w-5xl md:flex-row md:rounded-2xl md:px-0 md:mx-6 md:overflow-hidden md:shadow-2xl md:bg-white">
        {/* Lado esquerdo */}
        <div className="hidden md:flex w-1/2 bg-azulBase rounded-l-2xl items-center justify-center p-8">
          <img
            src={euroLogoWhite}
            alt="Logo da Euro Society"
            className="max-w-[90%] h-auto"
          />
        </div>

        {/* Formulário */}
        <div className="w-full md:w-1/2 flex flex-col items-center gap-6 py-10 md:py-16 px-6">
          <div className="flex flex-col items-center gap-3 md:hidden">
            <img
              src={euroLogoWhite}
              alt="Logo da Euro Society"
              style={{ height: "calc(100vh / 4)" }}
            />
            <h1 className="text-white text-3xl font-semibold">
              Redefinir Senha
            </h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            REDEFINIR SENHA
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              error={senhaError}
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
              onClick={handleSubmit}
              disabled={loading}
            />
          </form>

          {successMessage && (
            <p className="text-green-600 text-center mt-2">{successMessage}</p>
          )}

          <div className="text-center text-white text-sm md:text-gray-700">
            <p className="mt-2">
              <a
                href="/login"
                className="text-blue-300 md:text-blue-500 hover:underline"
              >
                Voltar para o Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
