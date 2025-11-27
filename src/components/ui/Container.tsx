import type { ReactNode } from 'react';
import './Container.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = ({
  children,
  className = '',
  size = 'lg',
}: ContainerProps) => {
  const classes = ['ui-container', `ui-container--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};
