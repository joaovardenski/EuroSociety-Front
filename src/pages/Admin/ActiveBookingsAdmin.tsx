import { useState } from "react";

// Components
import HeaderEuro from "../../components/HeaderEuro";
import AdminSidebar from "../../components/AdminSidebar";
import FooterEuro from "../../components/FooterEuro";
import { Search } from "lucide-react";
import FiltroData from "../../components/Filtros/FiltroData";
import FiltroTipo from "../../components/Filtros/FiltroTipo";
import TableActiveBookings from "../../components/TableActiveBookings";

import { reservasAtivas } from "../../data/Variaveis";

export default function ActiveBookingsAdmin() {
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState("2025-07-18"); // exemplo fixo

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f4ff]">
      <HeaderEuro />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-grow p-6 max-w-6xl w-full mx-auto bg-white mt-6 mb-10 rounded-3xl shadow-xl">
          <h1 className="text-xl font-semibold text-azulBase mb-4">
            Agendamentos ativos
          </h1>

          {/* Filtros */}
          <div className="bg-gray-100/50 border border-black rounded-xl mb-6 py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 pl-4">
              <FiltroData
                dataSelecionada={dataSelecionada}
                setDataSelecionada={setDataSelecionada}
              />
              <FiltroTipo
                tipoSelecionado={tipoSelecionado}
                setTipoSelecionado={setTipoSelecionado}
              />
            </div>
            <div className="flex">
              <input
                type="search"
                placeholder="Pesquisar"
                className="border-2 border-gray-600/50 py-1 px-2 rounded-xl outline-0"
              />
              <Search
                className="text-gray-600 relative right-8 top-2"
                size={18}
              />
            </div>
          </div>

          <TableActiveBookings agendamentos={reservasAtivas} />

        </main>
      </div>

      <FooterEuro />
    </div>
  );
}
