// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { ArrowLeft } from "lucide-react";

// Components
import HeaderEuro from "../../components/HeaderEuro";
import SearchOptionButton from "../../components/SearchOptionButton";
import BookingCard from "../../components/BookingCard";
import type { Reserva } from "../../components/BookingCard";
import FooterEuro from "../../components/FooterEuro";
import BottomNav from "../../components/BottomNav";

function Bookings() {
  const navigate = useNavigate();
  const reservas: Reserva[] = [
    {
      id: 1,
      quadra: "Quadra Society",
      data: "Sexta, 07 de Junho de 2025",
      horario: "19:00 - 20:00",
      valor: "R$ 150,00",
      status: "CONFIRMADA",
    },
    {
      id: 2,
      quadra: "Quadra Society",
      data: "Sexta, 07 de Junho de 2025",
      horario: "19:00 - 20:00",
      valor: "R$ 150,00",
      status: "CONFIRMADA",
    },
  ];

  const [searchOption, setSearchOption] = useState("Todas");

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f7ff]">
      <HeaderEuro />

      <main className="flex flex-col flex-grow mb-12 px-4 py-8 max-w-5xl mx-auto w-full md:mb-0">
        {/* Título e filtros */}
        <div className=" flex flex-col items-center justify-center gap-5 md:justify-between md:flex-row mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-azulBase hover:text-azulEscuro transition"
            >
              <ArrowLeft size={23} />
            </button>
            <h1 className="text-2xl font-semibold text-azulBase">
              Minhas reservas
            </h1>
          </div>

          <div className="flex gap-3">
            <SearchOptionButton
              label="Todas"
              isActive={searchOption === "Todas"}
              onClick={() => setSearchOption("Todas")}
            />
            <SearchOptionButton
              label="Próximas"
              isActive={searchOption === "Proximas"}
              onClick={() => setSearchOption("Proximas")}
            />
            <SearchOptionButton
              label="Anteriores"
              isActive={searchOption === "Anteriores"}
              onClick={() => setSearchOption("Anteriores")}
            />
          </div>
        </div>
        <hr className="hidden md:block mb-6 border-t-2 rounded-2xl border-azulBase opacity-70" />

        {/* Cards de reservas */}
        <div className="space-y-4">
          {reservas.length === 0 ? (
            <div className="flex flex-col bg-white items-center justify-center text-center text-gray-600 py-16">
              <p className="text-lg font-semibold mb-2">
                Você ainda não possui reservas.
              </p>
              <a
                href="/reservas" // ou use o `to` com Link se estiver usando react-router
                className="text-azulBase hover:text-azulEscuro transition"
              >
                Clique aqui para agendar uma nova reserva
              </a>
            </div>
          ) : (
            reservas.map((reserva) => (
              <BookingCard key={reserva.id} reserva={reserva} />
            ))
          )}
        </div>
      </main>

      <BottomNav />

      <FooterEuro />
    </div>
  );
}

export default Bookings;
