import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/euroSocietyIcon.png"

export default function NotAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 7000); // redirecionamento automático após 7 segundos

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col justify-center items-center px-4 text-center">
      <img src={escudo} alt="Escudo EuroSociety" className="w-50 mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold text-azulBase mb-4">Área restrita</h1>
      <p className="text-lg text-gray-700 max-w-lg">
        Você precisa estar logado para acessar esta página. Por favor, entre com sua conta para continuar.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="mt-6 bg-[#2b4363] text-white px-6 py-3 rounded-xl hover:bg-[#1f324b] transition"
      >
        Ir para Login
      </button>
      <p className="text-sm text-gray-500 mt-4">Redirecionando automaticamente em instantes...</p>
    </div>
  );
}
