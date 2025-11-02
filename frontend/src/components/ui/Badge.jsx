const Badge = ({ className = "", variant = "primary", ...props }) => {
  return <div className={`badge badge-${variant} ${className}`} {...props} />;
};

Badge.displayName = "Badge";

export default Badge;
