import React from 'react';
import { Icons } from './Icons';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const IconComponent = icon ? Icons[icon] : null;

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Icons.loader className="spinner" width={18} height={18} />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {IconComponent && iconPosition === 'left' && (
            <IconComponent width={18} height={18} />
          )}
          {children}
          {IconComponent && iconPosition === 'right' && (
            <IconComponent width={18} height={18} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;