import euroLogoWhite from "../../assets/euroSocietyWhite.png";
import GoogleButtonAuth from "../../components/GoogleButtonAuth";
import InputFieldAuth from "../../components/InputFieldAuth";
import SubmitButtonAuth from "../../components/SubmitButtonAuth";

function Login() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-azulBase to-roxo flex justify-center py-6">
      <div className="w-full max-w-md px-4 flex flex-col justify-between gap-6">
        {/* Topo: Logo e título */}
        <div className="flex flex-col items-center gap-3">
          <img src={euroLogoWhite} alt="Logo da Euro Society" style={{ width: 'calc(100vh / 4)' }}/>
          <h1 className="text-white text-3xl font-semibold">Login</h1>
        </div>

        {/* Formulário */}
        <form method="post" className="flex flex-col gap-4 w-full">
          <InputFieldAuth id="iemail" label="Email:" type="email" placeholder="Email" />
          <InputFieldAuth id="isenha" label="Senha:" type="password" placeholder="Senha" />

          {/* Botão Entrar */}
          <SubmitButtonAuth label="Entrar" icon="login" />
        </form>

        {/* Separador "ou" */}
        <div className="flex items-center w-full">
          <hr className="flex-grow border-gray-400" />
          <span className="mx-2 text-white font-medium">ou</span>
          <hr className="flex-grow border-gray-400" />
        </div>

        {/* Botão Google */}
        <GoogleButtonAuth label="Entrar com Google"/>

        {/* Rodapé: links */}
        <div className="text-center text-white text-sm mt-2">
          <p>
            Não tem uma conta?{" "}
            <a href="#" className="text-blue-300 hover:underline">
              Cadastre-se
            </a>
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue-300 hover:underline">
              Esqueceu sua senha?
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
