import { useState } from "react";

import euroLogoWhite from "../../assets/euroSocietyWhite.png";

// Components
import GoogleButtonAuth from "../../components/GoogleButtonAuth";
import InputFieldAuth from "../../components/InputFieldAuth";
import SubmitButtonAuth from "../../components/SubmitButtonAuth";

// Utils
import { getEmailError, getSenhaError } from "../../utils/Validators";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    const emailValidation = getEmailError(trimmedEmail);
    const senhaValidation = getSenhaError(trimmedSenha);

    setEmailError(emailValidation);
    setSenhaError(senhaValidation);

    if (!emailValidation && !senhaValidation) {
      console.log("Enviar dados:", { email: trimmedEmail, senha: trimmedSenha });
      // lógica de login aqui
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
            <h1 className="text-white text-3xl font-semibold">Login</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            LOGIN
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="iemail"
              label="Email:"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
            <InputFieldAuth
              id="isenha"
              label="Senha:"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              error={senhaError}
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
          <GoogleButtonAuth label="Entrar com Google" />

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
