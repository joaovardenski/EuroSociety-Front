import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/euroSocietyWhite.png"

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 8000); // redireciona automaticamente após 8 segundos

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col justify-center items-center px-4 text-center">
      <img src={escudo} alt="Escudo EuroSociety" className="w-70 mb-6 " />
      <h1 className="text-4xl font-bold text-red-400 mb-4">Acesso Negado</h1>
      <p className="text-lg text-white max-w-lg">
        Esta página é exclusiva para administradores do sistema. Se você acredita que isso é um erro,
        entre em contato com o suporte ou retorne para a tela de login.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="mt-6 bg-[#2b4363] text-white px-6 py-3 rounded-xl hover:bg-[#1f324b] transition"
      >
        Voltar para o Login
      </button>
      <p className="text-sm text-gray-100 mt-4">Você será redirecionado automaticamente em instantes...</p>
    </div>
  );
}
