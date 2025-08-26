export default function IconButton({ children, onClick, className = "" }: any) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white ${className}`}>
      {children}
    </button>
  );
}