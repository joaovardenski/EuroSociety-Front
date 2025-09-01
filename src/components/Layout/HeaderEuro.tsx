import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Loader2 } from "lucide-react";
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
import { getNomeCondensado } from "../../utils/NameUtils";
import axiosPrivate from "../../api/axiosPrivate";
import { AxiosError } from "axios";

export default function HeaderEuro() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user_nome");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  const handleLogout = async () => {
    setIsLogout(true); // ativa o loading
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
    } finally {
      setIsLogout(false); // desativa o loading se algo falhar
    }
  };

  return (
    <header className="bg-azulBase text-white flex items-center justify-center  px-6 py-2 shadow-md md:justify-between">
      <div className="flex items-center gap-3">
        <img src={euroLogoWhite} alt="Logo" className="h-21" />
        <h1 className="text-xl font-semibold">Euro Sports & Bar</h1>
      </div>
      <div className="relative">
        <div
          className="hidden md:flex items-center gap-4 cursor-pointer"
          onClick={toggleMenu}
        >
          <p className="font-semibold text-lg">Olá, {getNomeCondensado(user)}!</p>
          <UserCircle size={40} />
        </div>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-10 text-black">
            <button
              onClick={handleLogout}
              disabled={isLogout}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 disabled:opacity-60"
            >
              {isLogout ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              {isLogout ? "Saindo..." : "Sair"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
