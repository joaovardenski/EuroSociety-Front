interface GoogleButtonAuthProps {
  label: string;
  onClick?: () => void;
}

export default function GoogleButtonAuth({
  label,
  onClick,
}: GoogleButtonAuthProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-full gap-3 border border-gray-300 bg-white py-2 rounded-md hover:bg-gray-100 transition md:border-2"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">{label}</span>
    </button>
  );
}
