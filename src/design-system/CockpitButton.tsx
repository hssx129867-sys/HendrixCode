import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './CockpitButton.css';

export type CockpitButtonVariant = 'default' | 'primary' | 'danger';
export type CockpitButtonSize = 'small' | 'medium' | 'large';

interface CockpitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CockpitButtonVariant;
  size?: CockpitButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

/**
 * CockpitButton - Frontier cockpit themed button component
 * 
 * Features:
 * - Monospace font with letter spacing
 * - Glowing green borders and text shadows
 * - Transparent background with backdrop blur
 * - Hover effects with increased glow
 * - Touch-optimized for iPad
 */
export const CockpitButton = ({
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  ...props
}: CockpitButtonProps) => {
  const classes = [
    'cockpit-button',
    `cockpit-button--${variant}`,
    `cockpit-button--${size}`,
    fullWidth ? 'cockpit-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
