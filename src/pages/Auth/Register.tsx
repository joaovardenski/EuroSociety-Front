// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import GoogleButtonAuth from "../../components/Auth/GoogleButtonAuth";
import InputFieldAuth from "../../components/Auth/InputFieldAuth";
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
// Utils
import {
  getNomeError,
  getEmailError,
  getSenhaError,
} from "../../utils/Validators";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    const nameValidation = getNomeError(trimmedName);
    const emailValidation = getEmailError(trimmedEmail);
    const senhaValidation = getSenhaError(trimmedSenha);

    setNameError(nameValidation);
    setEmailError(emailValidation);
    setSenhaError(senhaValidation);

    if (!nameValidation && !emailValidation && !senhaValidation) {
      console.log("Enviar dados:", {
        name: trimmedName,
        email: trimmedEmail,
        senha: trimmedSenha,
      });
      // lógica de cadastro aqui
      // handleRegister(trimmedName, trimmedEmail, trimmedSenha);
      navigate("/login");
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <InputFieldAuth
              id="inome"
              label="Nome:"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
            />
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
              label="Registrar"
              icon="register"
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

          {/* Botão de registrar com Google */}
          <GoogleButtonAuth label="Entrar com Google" />

          {/* Links para entrar no sistema */}
          <div className="text-center text-white text-sm md:text-gray-700">
            <p>
              Já tem uma conta?{" "}
              <a
                href="/login"
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

export default Register;
