import { useMemo, useCallback } from "react";
import { gerarHorarios } from "../../utils/Horarios";

interface AvailableCourtsProps {
  nome: string;
  horaAbertura: string;
  horaFechamento: string;
  indisponiveis: string[];
  bloqueados: string[];
  onHorarioClick: (horario: string, indisponivel: boolean, bloqueado: boolean) => void;
  isAdmin: boolean;
}

interface HorarioButtonProps {
  hora: string;
  isIndisponivel: boolean;
  isBloqueado: boolean;
  isAdmin: boolean;
  onClick: () => void;
}

const HorarioButton = ({ hora, isIndisponivel, isBloqueado, isAdmin, onClick }: HorarioButtonProps) => {
  const getButtonClasses = () => {
    if (isBloqueado) return "bg-gray-300 text-gray-600 cursor-not-allowed";
    if (isIndisponivel) return "bg-yellow-200 text-gray-600 hover:bg-yellow-300/80";
    return "bg-white text-azulBase border-azulBase hover:bg-azulBase hover:text-white";
  };

  return (
    <button
      key={hora}
      className={`flex items-center justify-center px-5 py-2.5 w-18 rounded-lg border text-[14px] md:text-base font-semibold transition-all md:w-22 ${getButtonClasses()}`}
      onClick={onClick}
      disabled={!isAdmin && isBloqueado}
    >
      {hora}
    </button>
  );
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
  const horarios = useMemo(() => gerarHorarios(horaAbertura, horaFechamento), [horaAbertura, horaFechamento]);

  const handleClick = useCallback(
    (hora: string) => {
      const isIndisponivel = indisponiveis.includes(hora);
      const isBloqueado = bloqueados.includes(hora);
      onHorarioClick(hora, isIndisponivel, isBloqueado);
    },
    [indisponiveis, bloqueados, onHorarioClick]
  );

  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold text-xl text-azulBase">{nome}</h2>
      </div>

      <hr className="border opacity-60 mb-5" />

      <div className="flex flex-wrap gap-3">
        {horarios.map((hora) => (
          <HorarioButton
            key={hora}
            hora={hora}
            isIndisponivel={indisponiveis.includes(hora)}
            isBloqueado={bloqueados.includes(hora)}
            isAdmin={isAdmin}
            onClick={() => handleClick(hora)}
          />
        ))}
      </div>
    </div>
  );
}
