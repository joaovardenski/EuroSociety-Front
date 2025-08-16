import { useState } from "react";
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
// Lucide Icons
import { CheckCircle, XCircle } from "lucide-react";

interface RecoverPasswordResponse {
  message?: string;
}

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const validationError = getEmailRedefinicaoError(trimmedEmail);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setEmailError("");

    try {
      const response = await axiosPublic.post<RecoverPasswordResponse>(
        "/forgot-password",
        { email: trimmedEmail }
      );

      setSuccessMessage(
        response.data.message || "Link de recuperação enviado com sucesso!"
      );
      setEmail("");
    } catch (error) {
      const axiosError = error as AxiosError<
        RecoverPasswordResponse & { errors?: Record<string, string[]> }
      >;

      if (axiosError.response && axiosError.response.data) {
        const data = axiosError.response.data;
        const msg = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Erro ao enviar link de recuperação";
        setEmailError(msg);
        console.error("Erro na requisição:", data);
      } else {
        setEmailError("Erro ao conectar com o servidor");
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
              Recuperar Senha
            </h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            RECUPERAR SENHA
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />

            <SubmitButtonAuth
              label={loading ? "Enviando..." : "Enviar link de recuperação"}
              icon="send"
              disabled={loading}
            />
          </form>

          {successMessage && (
            <div
              className="flex items-center justify-center gap-2 text-green-700 bg-green-100 border border-green-300 rounded-md p-2 text-center mt-2 w-full"
              role="alert"
              aria-live="polite"
            >
              <CheckCircle size={25} />
              <span>{successMessage}</span>
            </div>
          )}

          {emailError && (
            <div
              className="flex items-center justify-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-md p-2 text-center mt-2 w-full"
              role="alert"
              aria-live="assertive"
            >
              <XCircle size={20} />
              <span>{emailError}</span>
            </div>
          )}

          {!successMessage && !emailError && (
            <p className="text-white text-[15px] text-center font-semibold md:text-gray-700">
              Um link de recuperação será enviado no seu endereço de email
            </p>
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
