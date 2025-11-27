/**
 * Design System - Cockpit Theme Components
 * 
 * This module exports reusable components with the frontier cockpit theme.
 * These components provide a consistent sci-fi/space-tech aesthetic across
 * the AR game and other cockpit-themed pages.
 * 
 * Color scheme: Neon green (#00ff88) on dark backgrounds
 * Typography: Monospace fonts (Courier New)
 * Effects: Glowing borders, backdrop blur, pulsing animations
 */

// Buttons
export { CockpitButton } from './CockpitButton';
export type { CockpitButtonVariant, CockpitButtonSize } from './CockpitButton';

// Panels
export {
  CockpitPanel,
  CockpitPanelHeader,
  CockpitPanelBody,
  CockpitPanelFooter,
} from './CockpitPanel';
export type { CockpitPanelVariant } from './CockpitPanel';

// Layout
export { CockpitContainer } from './CockpitContainer';
export type { CockpitContainerSize } from './CockpitContainer';
