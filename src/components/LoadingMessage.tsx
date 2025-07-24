interface LoadingMessageProps {
    message: string;
}

export default function LoadingMessage({message}: LoadingMessageProps) {
  return (
    <div className="flex flex-1 items-center justify-center w-full h-full mt-17">
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">{message}</p>
      </div>
    </div>
  );
}
