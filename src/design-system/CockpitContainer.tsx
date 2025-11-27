import type { ReactNode, HTMLAttributes } from 'react';
import './CockpitContainer.css';

export type CockpitContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface CockpitContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: CockpitContainerSize;
  centered?: boolean;
  children: ReactNode;
}

/**
 * CockpitContainer - Max-width responsive container for cockpit pages
 * 
 * Features:
 * - Responsive max-widths
 * - Auto-centering
 * - Padding management
 * - Works with cockpit theme
 */
export const CockpitContainer = ({
  size = 'lg',
  centered = true,
  children,
  className = '',
  ...props
}: CockpitContainerProps) => {
  const classes = [
    'cockpit-container',
    `cockpit-container--${size}`,
    centered ? 'cockpit-container--centered' : '',
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
