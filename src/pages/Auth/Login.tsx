import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import InputFieldAuth from "../../components/Auth/InputFieldAuth";
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
// API
import axiosPublic from "../../api/axiosPublic";
import axiosPrivate from "../../api/axiosPrivate";
import { AxiosError } from "axios";
// Icons
import { XCircle } from "lucide-react";
import { getEmailError, getSenhaError } from "../../utils/Validators";

// --- Tipagens ---
interface GoogleJwtPayload extends JwtPayload {
  name: string;
  email: string;
  sub: string;
}

interface FormState {
  email: string;
  senha: string;
}

interface AlertState {
  message: string;
  type: "error" | "success";
}

// --- Serviço de autenticação ---
const loginEmail = async (email: string, senha: string) => {
  return axiosPublic.post("/login", { email, senha });
};

const loginGoogle = async (email: string, google_id: string) => {
  return axiosPublic.post("/login", { email, google_id });
};

const fetchUser = async () => {
  try {
    const response = await axiosPrivate.get("/user");
    return response.data as { permissao: "admin" | "user" };
  } catch {
    return null;
  }
};

// --- Componentes pequenos ---
const AlertMessage = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-md p-2 text-center w-full transition-opacity duration-500 opacity-100">
    <XCircle size={20} />
    <span>{message}</span>
  </div>
);

// --- Componente principal ---
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ email: "", senha: "" });
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // --- Auto-login ---
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const user = await fetchUser();
      if (user?.permissao === "admin") navigate("/admin");
      else if (user) navigate("/home");
      else localStorage.removeItem("access_token");
    };
    autoLogin();
  }, [navigate]);

  // --- Limpar alert automaticamente ---
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 5000);
    return () => clearTimeout(timer);
  }, [alert]);

  // --- Função de login via email ---
  const handleLoginEmail = useCallback(async () => {
    setLoading(true);
    setAlert(null);

    try {
      const response = await loginEmail(form.email.trim(), form.senha.trim());
      localStorage.setItem("access_token", response.data.access_token);

      const user = await fetchUser();
      if (user?.permissao === "admin") navigate("/admin");
      else navigate("/home");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setAlert({
        message:
          axiosError.response?.data?.message ||
          "Erro ao conectar com o servidor.",
        type: "error",
      });
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  }, [form, navigate]);

  // --- Função de login via Google ---
  const handleLoginGoogle = useCallback(
    async (decoded: GoogleJwtPayload) => {
      setLoading(true);
      setAlert(null);

      try {
        const response = await loginGoogle(decoded.email, decoded.sub);
        localStorage.setItem("access_token", response.data.access_token);
        navigate("/home");
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setAlert({
          message:
            axiosError.response?.data?.message ||
            "Erro ao conectar com o servidor.",
          type: "error",
        });
        console.error("Erro no login Google:", error);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // --- Validação ---
  const validateForm = () => {
    const emailError = getEmailError(form.email.trim());
    const senhaError = getSenhaError(form.senha.trim());
    if (emailError || senhaError) return "Email ou senha inválidos!";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setAlert({ message: validationError, type: "error" });
      return;
    }
    handleLoginEmail();
  };

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
        <div className="w-full md:w-1/2 flex flex-col items-center gap-6 py-10 md:py-12 px-6">
          <div className="flex flex-col items-center gap-3 md:hidden">
            <img
              src={euroLogoWhite}
              alt="Logo da Euro Society"
              style={{ height: "calc(100vh / 4)" }}
            />
            <h1 className="text-white text-3xl font-semibold">Login</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            LOGIN
          </h1>

          {alert && <AlertMessage message={alert.message} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Digite seu email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />
            <SubmitButtonAuth
              label="Entrar"
              icon="login"
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

          {/* Login com Google */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decoded = jwtDecode<GoogleJwtPayload>(
                credentialResponse.credential!
              );
              handleLoginGoogle(decoded);
            }}
            onError={() => console.log("Login Google falhou")}
          />

          {/* Links */}
          <div className="text-center text-white text-sm md:text-gray-700 mt-4">
            <p>
              Não tem uma conta?{" "}
              <a
                href="/registrar"
                className="text-blue-300 md:text-blue-500 hover:underline"
              >
                Cadastre-se
              </a>
            </p>
            <p className="mt-2">
              <a
                href="/recuperar-senha"
                className="text-blue-300 md:text-blue-500 hover:underline"
              >
                Esqueceu sua senha?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
