import { useState } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import InputConfig from "../../components/InputConfig";

export default function VariablesAdmin() {
  // Society
  const [societyPrecoNormal, setSocietyPrecoNormal] = useState(120);
  const [societyPrecoApos18h, setSocietyPrecoApos18h] = useState(150);
  const [societyHoraAbertura, setSocietyHoraAbertura] = useState("08:00");
  const [societyHoraFechamento, setSocietyHoraFechamento] = useState("22:00");

  // Futevôlei 1
  const [fut1PrecoNormal, setFut1PrecoNormal] = useState(100);
  const [fut1PrecoApos18h, setFut1PrecoApos18h] = useState(120);
  const [fut1HoraAbertura, setFut1HoraAbertura] = useState("07:00");
  const [fut1HoraFechamento, setFut1HoraFechamento] = useState("21:00");

  // Futevôlei 2
  const [fut2PrecoNormal, setFut2PrecoNormal] = useState(100);
  const [fut2PrecoApos18h, setFut2PrecoApos18h] = useState(120);
  const [fut2HoraAbertura, setFut2HoraAbertura] = useState("07:00");
  const [fut2HoraFechamento, setFut2HoraFechamento] = useState("21:00");

  // Descontos mensalistas
  const [descontoSociety, setDescontoSociety] = useState(15);
  const [descontoFutevolei, setDescontoFutevolei] = useState(15);

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto max-h-130">
          <h1 className="text-2xl font-semibold text-azulBase mb-8">
            Variáveis e configurações
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Society */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                Quadra Society
              </h2>
              <div className="space-y-3">
                <InputConfig
                  label="Preço normal (R$/h)"
                  value={societyPrecoNormal}
                  onChange={setSocietyPrecoNormal}
                  type="number"
                />
                <InputConfig
                  label="Preço após 18h (R$/h)"
                  value={societyPrecoApos18h}
                  onChange={setSocietyPrecoApos18h}
                  type="number"
                />
                <InputConfig
                  label="Horário de abertura"
                  value={societyHoraAbertura}
                  onChange={setSocietyHoraAbertura}
                  type="time"
                />
                <InputConfig
                  label="Horário de fechamento"
                  value={societyHoraFechamento}
                  onChange={setSocietyHoraFechamento}
                  type="time"
                />
                <button className="mt-2 bg-[#2b4363] text-white px-4 py-2 rounded-md hover:bg-[#1f324b] transition">
                  Salvar Society
                </button>
              </div>
            </div>

            {/* Futevôlei 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                Quadra de Futevôlei 1
              </h2>
              <div className="space-y-3">
                <InputConfig
                  label="Preço normal (R$/h)"
                  value={fut1PrecoNormal}
                  onChange={setFut1PrecoNormal}
                  type="number"
                />
                <InputConfig
                  label="Preço após 18h (R$/h)"
                  value={fut1PrecoApos18h}
                  onChange={setFut1PrecoApos18h}
                  type="number"
                />
                <InputConfig
                  label="Horário de abertura"
                  value={fut1HoraAbertura}
                  onChange={setFut1HoraAbertura}
                  type="time"
                />
                <InputConfig
                  label="Horário de fechamento"
                  value={fut1HoraFechamento}
                  onChange={setFut1HoraFechamento}
                  type="time"
                />
                <button className="mt-2 bg-[#2b4363] text-white px-4 py-2 rounded-md hover:bg-[#1f324b] transition">
                  Salvar Futevôlei 1
                </button>
              </div>
            </div>

            {/* Futevôlei 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                Quadra de Futevôlei 2
              </h2>
              <div className="space-y-3">
                <InputConfig
                  label="Preço normal (R$/h)"
                  value={fut2PrecoNormal}
                  onChange={setFut2PrecoNormal}
                  type="number"
                />
                <InputConfig
                  label="Preço após 18h (R$/h)"
                  value={fut2PrecoApos18h}
                  onChange={setFut2PrecoApos18h}
                  type="number"
                />
                <InputConfig
                  label="Horário de abertura"
                  value={fut2HoraAbertura}
                  onChange={setFut2HoraAbertura}
                  type="time"
                />
                <InputConfig
                  label="Horário de fechamento"
                  value={fut2HoraFechamento}
                  onChange={setFut2HoraFechamento}
                  type="time"
                />
                <button className="mt-2 bg-[#2b4363] text-white px-4 py-2 rounded-md hover:bg-[#1f324b] transition">
                  Salvar Futevôlei 2
                </button>
              </div>
            </div>

            {/* Descontos */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                Planos mensalistas
              </h2>
              <div className="space-y-3">
                <InputConfig
                  label="Desconto (%) mensalista: Society"
                  value={descontoSociety}
                  onChange={setDescontoSociety}
                  type="number"
                />
                <InputConfig
                  label="Desconto (%) mensalista: Futevôlei"
                  value={descontoFutevolei}
                  onChange={setDescontoFutevolei}
                  type="number"
                />
                <button className="mt-2 bg-[#2b4363] text-white px-4 py-2 rounded-md hover:bg-[#1f324b] transition">
                  Salvar desconto
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <FooterEuro />
    </div>
  );
}
