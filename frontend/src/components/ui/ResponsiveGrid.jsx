import React from "react";

const ResponsiveGrid = ({
  children,
  columns = 4,
  gap = "1rem",
  className = "",
}) => {
  // Mapeando colunas para breakpoints Tailwind
  const colsClasses = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "md:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  return (
    <div
      className={`w-full grid gap-4 mb-8 max-w-7xl mx-auto ${
        colsClasses[columns] ?? ""
      } ${className}`}
      style={{ gap }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
