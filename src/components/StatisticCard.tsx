import type { ReactElement } from "react";

type StatisticCardProps = {
  icon: ReactElement;
  value: string | number;
  label: string;
  bg: string;
};

export default function StatisticCard({ icon, value, label, bg }: StatisticCardProps) {
  return (
    <div className="rounded-xl shadow-md p-4 bg-white flex flex-col items-center text-center hover:scale-104 hover:shadow-lg transition">
      <div className={`text-azulBase mb-2 p-4 rounded-[50%] ${bg}`}>
        {icon}
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-gray-700 font-medium mt-1">{label}</div>
    </div>
  );
}
