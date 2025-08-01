import { CalendarDays, DollarSign, Users, AlertTriangle } from "lucide-react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";

import { agendamentosRecentes } from "../../data/Variaveis";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import TableRecentBookings from "../../components/Reservas/TableRecentBookings";
import StatisticCard from "../../components/StatisticCard";
import { useEffect, useState } from "react";
import LoadingMessage from "../../components/LoadingMessage";

export default function PainelAdmin() {
  const [agendamentosHoje, setAgendamentosHoje] = useState(0);
  const [receitaMes, setReceitaMes] = useState(0);
  const [novosClientes, setNovosClientes] = useState(0);
  const [pagamentosPendentes, setPagamentosPendentes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        const agendamentosAPI = await getAgendamentos();
        const receitaAPI = await getReceita();
        const novosClientesAPI = await getNovosClientes();
        const pendentesAPI = await getPendentes();

        setAgendamentosHoje(agendamentosAPI);
        setReceitaMes(receitaAPI);
        setNovosClientes(novosClientesAPI);
        setPagamentosPendentes(pendentesAPI);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDadosDashboard();
  }, []);

  // Futuramente as chamadas de APIs para coleta de dados será aqui
  async function getAgendamentos(): Promise<number> {
    return import("../../data/Variaveis").then(
      (mod) => mod.estatisticasDashboard.agendamentosHoje
    );
  }

  async function getReceita(): Promise<number> {
    return import("../../data/Variaveis").then(
      (mod) => mod.estatisticasDashboard.receitaMes
    );
  }

  async function getNovosClientes(): Promise<number> {
    return import("../../data/Variaveis").then(
      (mod) => mod.estatisticasDashboard.novosClientes
    );
  }

  async function getPendentes(): Promise<number> {
    return import("../../data/Variaveis").then(
      (mod) => mod.estatisticasDashboard.pagamentosPendentes
    );
  }

  const estatisticas = [
    {
      icon: <CalendarDays size={32} />,
      label: "Agendamentos hoje",
      value: agendamentosHoje,
      bg: "bg-blue-200",
    },
    {
      icon: <DollarSign size={32} />,
      label: "Receita do mês",
      value: `R$ ${receitaMes}`,
      bg: "bg-green-200",
    },
    {
      icon: <Users size={32} />,
      label: "Novos clientes",
      value: novosClientes,
      bg: "bg-yellow-200",
    },
    {
      icon: <AlertTriangle size={32} />,
      label: "Pagamentos pendentes",
      value: pagamentosPendentes,
      bg: "bg-red-200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />
      {/* Menu lateral */}
      <div className="flex">
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            {isLoading ? (
              <LoadingMessage message="Carregando Dashboard" />
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[#052c64] mb-6">
                  Dashboard
                </h1>
                {/* Cards de estatística */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {estatisticas.map((stat, index) => (
                    <StatisticCard
                      key={index}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                      bg={stat.bg}
                    />
                  ))}
                </div>
                {/* Agendamentos recentes */}
                <TableRecentBookings recentBookings={agendamentosRecentes} />
              </>
            )}
          </main>
        </div>
      </div>
      <FooterEuro />
    </div>
  );
}
