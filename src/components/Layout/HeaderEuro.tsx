import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react";
import euroLogoWhite from "../../assets/euroSocietyWhite.png";
import { getPrimeiroEUltimoNome } from "../../utils/NameUtils";

interface HeaderEuroProps {
  nome: string;
}

export default function HeaderEuro({ nome }: HeaderEuroProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function handleLogout() {
    navigate("/login");
    localStorage.removeItem("access_token");
  }

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
          <p className="font-semibold text-lg">Olá, {getPrimeiroEUltimoNome(nome)}!</p>
          <UserCircle size={40} />
        </div>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-10 text-black">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
            >
              <UserCircle size={18} />
              Perfil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
