import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import type { Ocupacao } from "../../pages/Admin/ReportAdmin";

interface Props {
  dados: Ocupacao[];
  mes: number;
  setMes: (mes: number) => void;
}

export default function OcupacaoGrafico({ dados, mes, setMes }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-azulBase">Ocupação por quadra</h2>
        <div>
          <label className="text-gray-700 font-medium mr-2">Mês:</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border px-2 py-1 rounded-md"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("pt-BR", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quadra" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="usos" fill="#3182ce" name="Agendamentos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
