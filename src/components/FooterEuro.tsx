import euroLogoWhite from "../assets/euroSocietyWhite.png";

export default function FooterEuro() {
    return (
      <footer className="hidden bg-azulBase text-white py-2 px-6 md:flex items-center justify-between">
        <img src={euroLogoWhite} alt="Logo Euro Society" className="h-14" />
        <span className="text-sm text-center w-full">
          © 2025 Euro Sports. Todos os direitos reservados.
        </span>
        <div className="w-12" />{" "}
        {/* espaço compensado para centralizar o texto */}
      </footer>
    )
}