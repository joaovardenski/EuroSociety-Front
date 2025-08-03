import { gerarHorarios } from "../../utils/Horarios";

interface AvailableCourtsProps {
  nome: string;
  horaAbertura: string;
  horaFechamento: string;
  indisponiveis: string[];
  bloqueados: string[];
  onHorarioClick: (horario: string, indisponivel: boolean, bloqueado: boolean) => void;
  isAdmin: boolean;
};

export default function AvailableCourts({
  nome,
  horaAbertura,
  horaFechamento,
  indisponiveis,
  bloqueados,
  onHorarioClick,
  isAdmin,
}: AvailableCourtsProps) {
  const horarios = gerarHorarios(horaAbertura, horaFechamento);

  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold text-xl text-azulBase">{nome}</h2>
      </div>

      <hr className="border opacity-60 mb-5" />

      <div className="flex flex-wrap gap-3">
        {horarios.map((hora) => {
          const isIndisponivel = indisponiveis.includes(hora);
          const isBloqueado = bloqueados.includes(hora);

          return (
            <button
              key={hora}
              className={`flex items-center justify-center px-5 py-2.5 w-18 rounded-lg border text-[14px] md:text-base font-semibold transition-all md:w-22 ${
                isIndisponivel
                  ? "bg-yellow-200 text-gray-600"
                  : isBloqueado
                  ? "bg-gray-300 text-gray-600 line-through cursor-not-allowed"
                  : "bg-white text-azulBase border-azulBase hover:bg-azulBase hover:text-white"
              }`}
              onClick={() => onHorarioClick(hora, isIndisponivel, isBloqueado)}
              disabled={!isAdmin && isBloqueado}
            >
              {hora}
            </button>
          );
        })}
      </div>
    </div>
  );
}
