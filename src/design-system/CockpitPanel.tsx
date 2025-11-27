import type { ReactNode, HTMLAttributes } from 'react';
import './CockpitPanel.css';

export type CockpitPanelVariant = 'default' | 'elevated' | 'outlined';

interface CockpitPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CockpitPanelVariant;
  glow?: boolean;
  pulse?: boolean;
  children: ReactNode;
}

/**
 * CockpitPanel - HUD-style panel component with cockpit theme
 * 
 * Features:
 * - Semi-transparent dark background
 * - Glowing green borders
 * - Backdrop blur effect
 * - Optional pulse animation
 * - Inner and outer box shadows
 */
export const CockpitPanel = ({
  variant = 'default',
  glow = false,
  pulse = false,
  children,
  className = '',
  ...props
}: CockpitPanelProps) => {
  const classes = [
    'cockpit-panel',
    `cockpit-panel--${variant}`,
    glow ? 'cockpit-panel--glow' : '',
    pulse ? 'cockpit-panel--pulse' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

interface CockpitPanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CockpitPanelHeader = ({
  children,
  className = '',
  ...props
}: CockpitPanelHeaderProps) => {
  return (
    <div className={`cockpit-panel__header ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CockpitPanelBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CockpitPanelBody = ({
  children,
  className = '',
  ...props
}: CockpitPanelBodyProps) => {
  return (
    <div className={`cockpit-panel__body ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CockpitPanelFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CockpitPanelFooter = ({
  children,
  className = '',
  ...props
}: CockpitPanelFooterProps) => {
  return (
    <div className={`cockpit-panel__footer ${className}`} {...props}>
      {children}
    </div>
  );
};
