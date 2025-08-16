import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import InputFieldAuth from "../../components/Auth/InputFieldAuth";
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
import axiosPublic from "../../api/axiosPublic";
import axiosPrivate from "../../api/axiosPrivate";
import { AxiosError } from "axios";
// Icons
import { XCircle } from "lucide-react";

interface GoogleJwtPayload extends JwtPayload {
  name: string;
  email: string;
  sub: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUser() {
    try {
      const response = await axiosPrivate.get("/user");
      return response.data as { permissao: "admin" | "user" };
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return null;
    }
  }

  async function handleLogin(email: string, senha: string) {
    setLoading(true);
    setError("");

    try {
      const response = await axiosPublic.post("/login", { email, senha });
      const data = response.data as { access_token: string };
      localStorage.setItem("access_token", data.access_token);

      const user = await fetchUser();
      if (user?.permissao === "admin") navigate("/admin");
      else navigate("/");

    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response && axiosError.response.data) {
        setError(axiosError.response.data.message || "Erro desconhecido");
        console.error("Erro no login:", axiosError.response.data);
      } else {
        setError("Erro ao conectar com o servidor.");
        console.error("Erro no login:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginGoogle(decodedCredential: GoogleJwtPayload) {
    setLoading(true);
    setError("");

    try {
      const response = await axiosPublic.post("/login", {
        email: decodedCredential.email,
        google_id: decodedCredential.sub,
      });
      const data = response.data as { access_token: string };
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response && axiosError.response.data) {
        setError(axiosError.response.data.message || "Erro desconhecido");
        console.error("Erro no login com Google:", axiosError.response.data);
      } else {
        setError("Erro ao conectar com o servidor.");
        console.error("Erro no login com Google:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin(email.trim(), senha.trim());
  }

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
            <h1 className="text-white text-3xl font-semibold">Login</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">LOGIN</h1>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-md p-2 text-center w-full transition-opacity duration-500 opacity-100">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <SubmitButtonAuth
              label={loading ? "Entrando..." : "Entrar"}
              icon="login"
              disabled={loading}
            />
          </form>

          {/* Separador */}
          <div className="flex items-center w-full">
            <hr className="flex-grow border-gray-400 md:border-gray-300" />
            <span className="mx-2 text-white md:text-gray-600 font-medium">ou</span>
            <hr className="flex-grow border-gray-400 md:border-gray-300" />
          </div>

          {/* Login com Google */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decodedCredential = jwtDecode<GoogleJwtPayload>(credentialResponse.credential!);
              handleLoginGoogle(decodedCredential);
            }}
            onError={() => console.log("Login Google falhou")}
          />

          {/* Links */}
          <div className="text-center text-white text-sm md:text-gray-700 mt-4">
            <p>
              Não tem uma conta?{" "}
              <a href="/registrar" className="text-blue-300 md:text-blue-500 hover:underline">Cadastre-se</a>
            </p>
            <p className="mt-2">
              <a href="/recuperar-senha" className="text-blue-300 md:text-blue-500 hover:underline">Esqueceu sua senha?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
