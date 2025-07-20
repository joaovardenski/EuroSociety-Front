import { useNavigate } from "react-router-dom";
import escudo from "../../assets/euroSocietyIcon.png"

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] px-4 text-center">
      <img src={escudo} alt="Escudo EuroSociety" className="w-50 mb-6" />
      <h1 className="text-5xl font-bold text-azulBase mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
      <p className="text-gray-600 max-w-md mb-6">
        O caminho que você tentou acessar não existe ou foi removido. Mas calma, a bola ainda está em jogo!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-[#2b4363] text-white px-6 py-3 rounded-lg hover:bg-[#1f324b] transition"
        >
          Ir para página inicial
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-[#2b4363] border border-[#2b4363] px-6 py-3 rounded-lg hover:bg-[#f0f4f8] transition"
        >
          Fazer login
        </button>
      </div>
    </div>
  );
}
