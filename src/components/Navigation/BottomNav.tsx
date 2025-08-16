import { useNavigate, useLocation } from "react-router-dom";

import { Home, Calendar, ClipboardList, LogOut } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_nome");
    navigate("/login");
  }

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
        onClick={() => navigate("/agendamento")}
        className={`flex flex-col items-center ${
          isActive("/agendamento") ? "text-azulBase" : "text-gray-600"
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
        onClick={() => handleLogout()}
        className={`flex flex-col items-center text-red-500/90`}
      >
        <LogOut size={22} />
        <span className="text-xs">Sair</span>
      </button>
    </nav>
  );
}
