import { useNavigate, useLocation } from "react-router-dom";
import axiosPrivate from "../../api/axiosPrivate";
import { AxiosError } from "axios";

import {
  LayoutDashboard,
  CalendarDays,
  ListCheck,
  ChartNoAxesCombined,
  Waypoints,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await axiosPrivate.post("/logout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_nome");
      navigate("/");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(
        "Erro ao fazer logout:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <aside className="w-64 bg-[#052c64] text-white flex flex-col justify-between ">
      <div>
        <nav className="pt-5">
          <a
            href="/admin"
            className={`flex gap-2 px-4 py-4 font-semibold ${
              isActive("/admin")
                ? "bg-cyan-500 text-[#001a3f] border-l-4 border-white"
                : "text-white hover:bg-cyan-500"
            }`}
          >
            <LayoutDashboard /> Dashboard
          </a>

          <a
            href="/admin/agenda"
            className={`flex gap-2 px-4 py-4 font-semibold ${
              isActive("/admin/agenda")
                ? "bg-cyan-500 text-[#001a3f] border-l-4 border-white"
                : "text-white hover:bg-cyan-500"
            }`}
          >
            <CalendarDays /> Agenda
          </a>

          <a
            href="/admin/lista-reservas"
            className={`flex gap-2 px-4 py-4 font-semibold ${
              isActive("/admin/lista-reservas")
                ? "bg-cyan-500 text-[#001a3f] border-l-4 border-white"
                : "text-white hover:bg-cyan-500"
            }`}
          >
            <ListCheck /> Reservas ativas
          </a>

          <a
            href="/admin/relatorios"
            className={`flex gap-2 px-4 py-4 font-semibold ${
              isActive("/admin/relatorios")
                ? "bg-cyan-500 text-[#001a3f] border-l-4 border-white"
                : "text-white hover:bg-cyan-500"
            }`}
          >
            <ChartNoAxesCombined /> Relatórios
          </a>

          <a
            href="/admin/variaveis"
            className={`flex gap-2 px-4 py-4 font-semibold ${
              isActive("/admin/variaveis")
                ? "bg-cyan-500 text-[#001a3f] border-l-4 border-white"
                : "text-white hover:bg-cyan-500"
            }`}
          >
            <Waypoints /> Variáveis
          </a>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex gap-2 justify-center hover:text-red-500 px-4 py-4 border-t border-white"
      >
        <LogOut /> Sair
      </button>
    </aside>
  );
}
