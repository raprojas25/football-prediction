import React from 'react';

interface BadgeProps {
  metric:string;
  value:number;
  className?:string;
  percent?:boolean;
  /** Tamaño del texto: 'sm', 'base' (por defecto) o 'lg' */
  size?: 'sm' | 'base' | 'lg';
  /** Color del texto: 'default' (gris oscuro/claro) o 'muted' (más suave) */
  color?: 'default' | 'muted';
  /** Espaciado inferior: si es true, añade margin-bottom */
  margin?: boolean;
}

export const BadgeStat: React.FC<BadgeProps> = ({
  metric,
  value,
  percent= true,
  className = '',
}) => {

  return (
    <div className={`flex justify-between items-center rounded-lg border border-betano-border p-2 bg-white/5 ${className}`}>
      <span className="text-sm font-bold">
        {metric}
      </span>
      <span className="text-betano-green text-sm">
        {value}
        {percent && "%"}
      </span>
    </div>
  );
};

