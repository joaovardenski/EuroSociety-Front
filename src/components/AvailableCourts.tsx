import { gerarHorarios } from "../utils/Horarios";

// src/components/QuadraDisponivel.tsx
type Props = {
  nome: string;
  horaAbertura: number;
  horaFechamento: number;
  indisponiveis: string[];
  onHorarioClick: {(horario: string, indisponivel: boolean): void;}
};

export default function AvailableCourts ({
  nome,
  horaAbertura,
  horaFechamento,
  indisponiveis,
  onHorarioClick,
}: Props) {
  const horarios = gerarHorarios(horaAbertura, horaFechamento);

  return (
    <div>
      <h2 className="font-bold text-xl text-azulBase mb-1">{nome}</h2>
      <hr className="border opacity-60 mb-5" />
      <div className="flex flex-wrap gap-3">
        {horarios.map((hora) => {
          const isIndisponivel = indisponiveis.includes(hora);
          return (
            <button
              key={hora}
              disabled={isIndisponivel}
              className={`flex items-center justify-center px-5 py-2.5 w-18 rounded-lg border text-[14px] md:text-base font-semibold transition-all md:w-22 ${
                isIndisponivel
                  ? "bg-gray-300 text-gray-600 line-through cursor-not-allowed"
                  : "bg-white text-azulBase border-azulBase hover:bg-azulBase hover:text-white"
              }`}
              onClick={() => onHorarioClick(hora, isIndisponivel)}
            >
              {hora}
            </button>
          );
        })}
      </div>
    </div>
  );
}
