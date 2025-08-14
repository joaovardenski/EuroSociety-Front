// Hooks
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

interface GoogleJwtPayload extends JwtPayload {
  name: string;
  email: string;
  sub: string;
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

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
    try {
      const response = await axiosPublic.post("/login", {
        email: email,
        password: senha,
      });

      const data = response.data as { access_token: string };
      console.log("Login bem-sucedido:", data);

      // Salva o token no localStorage para futuras requisições
      localStorage.setItem("access_token", data.access_token);

      const user = await fetchUser(); // pega a permissão do usuário

      if (user?.permissao === "admin") {
        navigate("/admin"); // redireciona admins para a página admin
      } else {
        navigate("/"); // usuários normais para a home
      }

      // Limpa qualquer mensagem de erro
      setError("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response && axiosError.response.data) {
        // Se houver uma mensagem de erro na resposta da API
        setError(axiosError.response.data.message || "Erro desconhecido");
        console.error("Erro no login:", axiosError.response.data);
      } else {
        // Para erros que não vêm da API (ex: problema de rede)
        setError("Erro ao conectar com o servidor.");
        console.error("Erro no login:", error);
      }
    }
  }

  async function handleLoginGoogle(decodedCredential: GoogleJwtPayload) {
    try {
      const response = await axiosPublic.post("/login", {
        email: decodedCredential.email,
        google_id: decodedCredential.sub,
      });

      const data = response.data as { access_token: string };
      console.log("Login com Google bem-sucedido:", data);

      localStorage.setItem("access_token", data.access_token);
      setError(""); // Limpa o erro anterior, se houver
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
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Limpa espaços em branco no inicio e no fim do dado antes de validar
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    handleLogin(trimmedEmail, trimmedSenha);
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
            <h1 className="text-white text-3xl font-semibold">Login</h1>
          </div>
          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            LOGIN
          </h1>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <SubmitButtonAuth
              label="Entrar"
              icon="login"
              onClick={handleSubmit}
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
          {/* Botão de entrar com Google */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse.credential);
              const decodedCredential = jwtDecode<GoogleJwtPayload>(
                credentialResponse.credential!
              );
              console.log(decodedCredential);
              handleLoginGoogle(decodedCredential);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          ></GoogleLogin>
          {/* Links para cadastro e esqueci a senha*/}
          <div className="text-center text-white text-sm md:text-gray-700">
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
          </div>{" "}
          {/* Fim dos links */}
        </div>{" "}
        {/* Fim do lado do formulário */}
      </div>{" "}
      {/* Fim do card principal */}
    </div>
  );
}

export default Login;
