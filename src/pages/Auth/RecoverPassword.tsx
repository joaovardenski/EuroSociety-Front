import { useState } from "react";

import euroLogoWhite from "../../assets/euroSocietyWhite.png";

// Components
import InputFieldAuth from "../../components/InputFieldAuth";
import SubmitButtonAuth from "../../components/SubmitButtonAuth";

// Utils
import { getEmailError } from "../../utils/Validators";

function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emailValidation = getEmailError(email);

    setEmailError(emailValidation);

    if (!emailValidation) {
      console.log("Enviar dados:", { email });
      // lógica de recuperação aqui
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
            <h1 className="text-white text-3xl font-semibold">Recuperar Senha</h1>
          </div>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            RECUPERAR SENHA
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
            <SubmitButtonAuth label="Enviar link de recuperação" icon="send" onClick={handleSubmit}/>
          </form>

          <p className="text-white text-[15px] text-center font-semibold md:text-gray-700">Um link de recuperação será enviado no seu endereço de email</p>

          {/* Links para cadastro e esqueci a senha*/}
          <div className="text-center text-white text-sm md:text-gray-700">
            <p className="mt-2">
              <a href="/login" className="text-blue-300 md:text-blue-500 hover:underline">
                Voltar para o Login
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RecoverPassword;
