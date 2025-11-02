const Button = ({ className = "", variant = "primary", size, ...props }) => {
  const sizeClass = size ? `btn-${size}` : "";

  return (
    <button
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      {...props}
    />
  );
};

Button.displayName = "Button";

export { Button };
