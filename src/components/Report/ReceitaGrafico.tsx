import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import type { Receita } from "../../pages/Admin/ReportAdmin";

interface Props {
  dados: Receita[];
  ano: number;
  setAno: (ano: number) => void;
}

export default function ReceitaGrafico({ dados, ano, setAno }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-azulBase">Receita por período</h2>
        <div>
          <label className="text-gray-700 font-medium mr-2">Ano:</label>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="border px-2 py-1 rounded-md"
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="valor" stroke="#2b4363" name="Receita (R$)" strokeWidth={3} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
