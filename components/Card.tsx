const Card: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-soft ${className || ''}`}>
      {title && <div className="mb-4 text-lg font-semibold">{title}</div>}
      {subtitle && <div className="mb-4 text-lg font-semibold">{subtitle}</div>}
      {children}
    </div>
  );
};

export default Card;
