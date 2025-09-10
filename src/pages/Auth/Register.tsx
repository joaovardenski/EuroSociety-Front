import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import InputFieldAuth from "../../components/Auth/InputFieldAuth";
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
// Utils
import {
  getNomeError,
  getEmailError,
  getSenhaError,
} from "../../utils/Validators";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
// API
import axiosPublic from "../../api/axiosPublic";
import { AxiosError } from "axios";
// Icons
import { Mail } from "lucide-react";

// --- Tipagens ---
interface GoogleJwtPayload extends JwtPayload {
  name: string;
  email: string;
  sub: string;
}

interface FormState {
  name: string;
  email: string;
  senha: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  senha?: string;
}

// --- Serviço de registro ---
const registerEmail = async (data: {
  nome: string;
  email: string;
  senha: string;
}) => {
  return axiosPublic.post("/register", {
    ...data,
    permissao: "user",
    metodo_login: "email",
  });
};

const registerGoogle = async (data: {
  nome: string;
  email: string;
  google_id: string;
}) => {
  return axiosPublic.post("/register", {
    ...data,
    permissao: "user",
    metodo_login: "google",
  });
};

// --- Componentes pequenos ---
const AlertMessage = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center gap-2 text-green-700 bg-green-100 border border-green-300 rounded-md p-2 text-center w-full transition-opacity duration-500 opacity-100">
    <Mail size={20} />
    <span>{message}</span>
  </div>
);

// --- Componente principal ---
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [verificarEmail, setVerificarEmail] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", email: "", senha: "" });
    setErrors({});
  };

  // --- Registro via email ---
  const handleRegisterEmail = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      await registerEmail({
        nome: form.name.trim(),
        email: form.email.trim(),
        senha: form.senha.trim(),
      });

      setVerificarEmail(true);
      resetForm();
    } catch (error) {
      const axiosError = error as AxiosError<{ errors?: { email?: string[] } }>;
      if (axiosError.response?.data?.errors?.email?.[0]) {
        setErrors({ email: axiosError.response.data.errors.email[0] });
      } else {
        console.error("Erro no registro:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [form]);

  // --- Registro via Google ---
  const handleRegisterGoogle = useCallback(
    async (decoded: GoogleJwtPayload) => {
      setLoading(true);
      setErrors({});

      try {
        const response = await registerGoogle({
          nome: decoded.name,
          email: decoded.email,
          google_id: decoded.sub,
        });

        const data = response.data as { access_token: string };
        localStorage.setItem("access_token", data.access_token);
        navigate("/home");
      } catch (error) {
        const axiosError = error as AxiosError<{
          errors?: { email?: string[] };
        }>;
        if (axiosError.response?.data?.errors?.email?.[0]) {
          setErrors({ email: axiosError.response.data.errors.email[0] });
        } else {
          console.error("Erro no registro com Google:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // --- Submit do formulário ---
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const nameError = getNomeError(form.name.trim());
      const emailError = getEmailError(form.email.trim());
      const senhaError = getSenhaError(form.senha.trim());

      setErrors({ name: nameError, email: emailError, senha: senhaError });

      if (!nameError && !emailError && !senhaError) {
        handleRegisterEmail();
      }
    },
    [form, handleRegisterEmail]
  );

  // --- Limpar timer do alert ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (verificarEmail) {
      timer = setTimeout(() => setVerificarEmail(false), 10000);
    }
    return () => clearTimeout(timer);
  }, [verificarEmail]);

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
        <div className="w-full md:w-1/2 flex flex-col items-center gap-6 py-10 md:py-10 px-6">
          <div className="flex flex-col items-center gap-3 md:hidden">
            <img
              src={euroLogoWhite}
              alt="Logo da Euro Society"
              style={{ height: "calc(100vh / 5)" }}
            />
            <h1 className="text-white text-3xl font-semibold">Registrar</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            REGISTRAR
          </h1>

          {verificarEmail && (
            <AlertMessage message="Uma mensagem de confirmação de email foi enviada, verifique sua caixa postal!" />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="inome"
              label="Nome:"
              type="text"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              disabled={loading}
            />
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              disabled={loading}
            />
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
              error={errors.senha}
              disabled={loading}
            />

            <SubmitButtonAuth
              label={loading ? "Registrando..." : "Registrar"}
              icon="register"
              disabled={loading}
              loading={loading}
            />
          </form>

          {/* Separador */}
          <div className="flex items-center w-full">
            <hr className="flex-grow border-gray-400 md:border-gray-300" />
            <span className="mx-2 text-white md:text-gray-600 font-medium">
              ou
            </span>
            <hr className="flex-grow border-gray-400 md:border-gray-300" />
          </div>

          {/* Registro com Google */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decodedCredential = jwtDecode<GoogleJwtPayload>(
                credentialResponse.credential!
              );
              handleRegisterGoogle(decodedCredential);
            }}
            onError={() => console.log("Registro Google falhou")}
          />

          {/* Links */}
          <div className="text-center text-white text-sm md:text-gray-700 mt-4">
            <p>
              Já tem uma conta?{" "}
              <a
                href="/"
                className="text-blue-300 md:text-blue-500 hover:underline"
              >
                Entrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
