import { CalendarDays, DollarSign, Users, AlertTriangle } from "lucide-react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";

import AdminSidebar from "../../components/Navigation/AdminSidebar";
import TableRecentBookings from "../../components/Reservas/TableRecentBookings";
import StatisticCard from "../../components/StatisticCard";
import LoadingMessage from "../../components/LoadingMessage";
import { useDashboardAdminData } from "../../hooks/useDashboardAdminData";

export default function PainelAdmin() {
  const { data, loading } = useDashboardAdminData();

  const estatisticas = [
    {
      icon: <CalendarDays size={32} />,
      label: "Agendamentos hoje",
      value: data?.agendamentosHoje ?? 0,
      bg: "bg-blue-200",
    },
    {
      icon: <DollarSign size={32} />,
      label: "Receita do mês",
      value: `R$ ${data?.receitaMes ?? 0}`,
      bg: "bg-green-200",
    },
    {
      icon: <Users size={32} />,
      label: "Novos clientes",
      value: data?.novosClientes ?? 0,
      bg: "bg-yellow-200",
    },
    {
      icon: <AlertTriangle size={32} />,
      label: "Pagamentos pendentes",
      value: data?.pagamentosPendentes ?? 0,
      bg: "bg-red-200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            {loading ? (
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
                <TableRecentBookings
                  recentBookings={data?.ultimasReservas ?? []}
                />
              </>
            )}
          </main>
        </div>
      </div>
      <FooterEuro />
    </div>
  );
}