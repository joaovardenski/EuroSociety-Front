import { useNavigate, useLocation } from "react-router-dom";

import { Home, Calendar, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow md:hidden flex justify-around items-center h-16 z-20">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center ${
          isActive("/") ? "text-azulBase" : "text-gray-600"
        } hover:text-azulBase`}
      >
        <Home size={22} />
        <span className="text-xs">Início</span>
      </button>

      <button
        onClick={() => navigate("/agenda")}
        className={`flex flex-col items-center ${
          isActive("/agenda") ? "text-azulBase" : "text-gray-600"
        } hover:text-azulBase`}
      >
        <Calendar size={22} />
        <span className="text-xs">Agenda</span>
      </button>

      <button
        onClick={() => navigate("/minhas-reservas")}
        className={`flex flex-col items-center ${
          isActive("/minhas-reservas") ? "text-azulBase" : "text-gray-600"
        } hover:text-azulBase`}
      >
        <ClipboardList size={22} />
        <span className="text-xs">Reservas</span>
      </button>

      <button
        onClick={() => navigate("/perfil")}
        className={`flex flex-col items-center ${
          isActive("/perfil") ? "text-azulBase" : "text-gray-600"
        } hover:text-azulBase`}
      >
        <User size={22} />
        <span className="text-xs">Perfil</span>
      </button>
    </nav>
  );
}
