// src/pages/ResultadoPagamento.tsx
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axiosPrivate from "../../api/axiosPrivate";

export default function ResultadoPagamento() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const externalReference = searchParams.get("external_reference");
  const preferenceId = searchParams.get("preference_id");

  const [status, setStatus] = useState<string | null>(
    searchParams.get("status")
  );

  useEffect(() => {
    if (paymentId) {
      axiosPrivate.get(`/mercado-pago/${paymentId}/getPayment`)
        .then((res) => {
          if (res.data.success) {
            setStatus(res.data.payment.status);
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar pagamento:", err);
        });
    }
  }, [paymentId]);

  // Define mensagem, cor e ícone baseado no status
  let mensagem = "";
  let Icon = Clock;
  let color = "text-gray-500";

  switch (status) {
    case "approved":
      mensagem = "Pagamento aprovado! Obrigado por reservar.";
      Icon = CheckCircle;
      color = "text-green-500";
      break;
    case "pending":
      mensagem = "Pagamento pendente. Aguardando confirmação.";
      Icon = Clock;
      color = "text-yellow-500";
      break;
    case "rejected":
      mensagem = "Pagamento rejeitado. Tente novamente.";
      Icon = XCircle;
      color = "text-red-500";
      break;
    default:
      mensagem = "Status do pagamento desconhecido.";
      Icon = XCircle;
      color = "text-gray-500";
      break;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div
          className={`mb-6 mx-auto w-24 h-24 flex items-center justify-center rounded-full border-4 ${color} border-current`}
        >
          <Icon size={48} className={color} />
        </div>
        <h1 className="text-2xl font-bold mb-4">{mensagem}</h1>
        <div className="text-gray-600 space-y-2">
          {externalReference && (
            <p>
              <span className="font-semibold">Reserva:</span>{" "}
              {externalReference}
            </p>
          )}
          {preferenceId && (
            <p>
              <span className="font-semibold">Preference ID:</span>{" "}
              {preferenceId}
            </p>
          )}
          {paymentId && (
            <p>
              <span className="font-semibold">Payment ID:</span> {paymentId}
            </p>
          )}
        </div>
        <div className="mt-6">
          <a
            href="/home"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    </div>
  );
}
