import React from "react";

const VARIANT_STYLES = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  purple:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
};

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const ICON_SIZE = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  size?: "sm"| "md" | "lg";
  icon?:any;
  className?:string;
  // children: React.ReactNode | string | number;
  children: any;
}

export const Badge:React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center gap-1.5 font-medium rounded-full transition-colors duration-200 select-none";
  const variantClass = VARIANT_STYLES[variant];
  const sizeClass = SIZE_STYLES[size] || SIZE_STYLES.md;
  const iconClass = ICON_SIZE[size] || ICON_SIZE.md;

  return (
    <span
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      role="status"
      {...props}
    >
      {icon && (
        <span className={`inline-flex shrink-0 ${iconClass}`}>{icon}</span>
      )}
      {children}
    </span>
  );
};

