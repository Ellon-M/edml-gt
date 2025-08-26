// components/Card.tsx
import React from "react";

const Card: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-soft overflow-hidden min-w-0 ${className ?? ""}`}
      role="region"
    >
      {title && <div className="mb-1 text-base sm:text-lg font-semibold text-gray-900">{title}</div>}
      {subtitle && <div className="mb-4 text-sm text-gray-500">{subtitle}</div>}
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default Card;
