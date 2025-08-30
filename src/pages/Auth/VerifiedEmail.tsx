import { useNavigate } from "react-router-dom";
// Assets
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
// Components
import SubmitButtonAuth from "../../components/Auth/SubmitButtonAuth";
import { MailCheck } from "lucide-react";

export default function EmailVerificado() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-azulBase to-roxo md:bg-none md:bg-[#e1e6f9]">
      <div className="w-full max-w-md px-4 flex flex-col gap-6 md:max-w-5xl md:flex-row md:rounded-2xl md:px-0 md:mx-6 md:overflow-hidden md:shadow-2xl md:bg-white">
        
        {/* Lado esquerdo */}
        <div className="hidden md:flex w-1/2 bg-azulBase rounded-l-2xl items-center justify-center p-8">
          <img src={euroLogoWhite} alt="Logo da Euro Society" className="max-w-[90%] h-auto" />
        </div>

        {/* Conteúdo principal */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-6 py-10 px-6 text-center">
          <div className="flex flex-col items-center gap-3 md:hidden">
            <img src={euroLogoWhite} alt="Logo da Euro Society" style={{ height: "calc(100vh / 5)" }} />
            <h1 className="text-white text-3xl font-semibold">Email Verificado</h1>
          </div>

          <MailCheck size={80} className="text-white md:text-azulBase"/>

          <h1 className="hidden md:block text-2xl font-bold text-black text-center">
            EMAIL VERIFICADO
          </h1>

          <p className="md:text-gray-700 *:text-lg text-white">
            Seu e-mail foi confirmado com sucesso!  
          </p>
          <p className="md:text-gray-600 text-white">
            Agora você já pode acessar sua conta e aproveitar todos os recursos.
          </p>

          <SubmitButtonAuth
            label="Ir para o Login"
            icon="login"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
}
