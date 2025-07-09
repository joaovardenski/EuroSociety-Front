// src/components/SearchOptionButton.tsx
interface SearchOptionButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SearchOptionButton({
  label,
  isActive,
  onClick,
}: SearchOptionButtonProps) {
  return (
    <button
      className={`px-4 py-1 rounded-full text-sm transition ${
        isActive
          ? "bg-azulBase text-white"
          : "border border-gray-400 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
