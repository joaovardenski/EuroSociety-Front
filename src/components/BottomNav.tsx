import { Home, Calendar, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow md:hidden flex justify-around items-center h-16 z-20">
      <button className="flex flex-col items-center text-azulBase hover:text-azulBase/80">
        <Home size={22} />
        <span className="text-xs">Início</span>
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-azulBase">
        <Calendar size={22} />
        <span className="text-xs">Agenda</span>
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-azulBase">
        <ClipboardList size={22} />
        <span className="text-xs">Reservas</span>
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-azulBase">
        <User size={22} />
        <span className="text-xs">Perfil</span>
      </button>
    </nav>
  );
}
