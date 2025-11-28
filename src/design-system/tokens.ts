/**
 * Design Tokens - Cockpit Theme
 * 
 * This file defines the core design tokens for the Frontier Cockpit theme.
 * These tokens provide a consistent foundation for all UI components across
 * the application, ensuring visual cohesion and ease of maintenance.
 * 
 * Theme Philosophy:
 * - High-tech cockpit/HUD aesthetic
 * - Neon green (#00ff88) as primary accent
 * - Dark space backgrounds
 * - Glowing effects and shadows
 * - Monospace typography for tech feel
 * - iPad-first touch targets and spacing
 */

export const designTokens = {
  /**
   * Color Palette
   */
  colors: {
    // Primary colors
    cockpitGreen: '#00ff88',
    cockpitGreenLight: '#a0ffd0',
    cockpitGreenDark: '#00cc6a',
    
    // Background colors
    darkSpace: '#0a0a0a',
    deepOcean: 'rgba(0, 20, 40, 0.85)',
    deepOceanLight: 'rgba(0, 20, 40, 0.5)',
    
    // Gradient backgrounds
    gradientStart: '#0a1f35',
    gradientMid: '#1a0f2e',
    gradientEnd: '#0f1419',
    
    // Semantic colors
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
    info: '#00ccff',
    
    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    
    // Grid pattern color
    gridPattern: 'rgba(0, 255, 136, 0.03)',
  },

  /**
   * Typography
   */
  typography: {
    // Font families
    fontPrimary: "'Courier New', monospace",
    fontFallback: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    
    // Font sizes (responsive via clamp)
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    
    // Font weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.75,
    },
    
    // Letter spacing
    letterSpacing: {
      tight: '1px',
      normal: '2px',
      wide: '3px',
    },
  },

  /**
   * Spacing Scale
   * Based on 0.25rem (4px) increments
   */
  spacing: {
    '0': '0',
    'px': '1px',
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '8': '2rem',        // 32px
    '10': '2.5rem',     // 40px
    '12': '3rem',       // 48px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
  },

  /**
   * Border Radius
   */
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '10px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  /**
   * Shadows and Glows (Cockpit Theme Specific)
   */
  effects: {
    // Box shadows with cockpit green glow
    shadowGlow: {
      sm: '0 0 10px rgba(0, 255, 136, 0.2)',
      base: '0 0 15px rgba(0, 255, 136, 0.3)',
      md: '0 0 20px rgba(0, 255, 136, 0.3)',
      lg: '0 0 30px rgba(0, 255, 136, 0.4)',
      xl: '0 0 40px rgba(0, 255, 136, 0.6)',
    },
    
    // Inner shadows for inset glow
    shadowInset: {
      sm: 'inset 0 0 10px rgba(0, 255, 136, 0.1)',
      base: 'inset 0 0 15px rgba(0, 255, 136, 0.1)',
      md: 'inset 0 0 20px rgba(0, 255, 136, 0.15)',
      lg: 'inset 0 0 25px rgba(0, 255, 136, 0.2)',
    },
    
    // Text shadows for glowing text
    textGlow: {
      sm: '0 0 10px rgba(0, 255, 136, 0.5)',
      base: '0 0 15px rgba(0, 255, 136, 0.6)',
      md: '0 0 20px rgba(0, 255, 136, 0.6)',
      lg: '0 0 30px rgba(0, 255, 136, 0.8)',
    },
    
    // Backdrop blur
    backdropBlur: {
      sm: 'blur(5px)',
      base: 'blur(10px)',
      md: 'blur(15px)',
      lg: 'blur(20px)',
    },
  },

  /**
   * Transitions and Animations
   */
  transitions: {
    // Durations
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
    },
    
    // Timing functions
    easing: {
      linear: 'linear',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
    },
    
    // Common transition strings
    all: 'all 0.3s ease',
    colors: 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
    transform: 'transform 0.3s ease',
    opacity: 'opacity 0.3s ease',
  },

  /**
   * Z-Index Scale
   */
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 100,
    overlay: 1000,
    modal: 5000,
    toast: 10000,
    arSession: 9999,
  },

  /**
   * Breakpoints for Responsive Design
   */
  breakpoints: {
    sm: '640px',   // Small devices (phones)
    md: '768px',   // Medium devices (tablets portrait)
    lg: '1024px',  // Large devices (tablets landscape, laptops)
    xl: '1280px',  // Extra large devices (desktops)
    '2xl': '1536px', // 2X large devices (large desktops)
  },

  /**
   * Touch Target Sizes (iOS/Material Design Guidelines)
   */
  touchTargets: {
    min: '44px',       // iOS minimum
    recommended: '48px', // Material Design recommended
    large: '56px',     // Primary actions
    xl: '64px',        // Hero CTAs
  },

  /**
   * Container Max Widths
   */
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /**
   * Grid Pattern (for background effect)
   */
  gridPattern: {
    lineWidth: '2px',
    cellSize: '40px',
    color: 'rgba(0, 255, 136, 0.03)',
  },
} as const;

/**
 * Type-safe design token access
 */
export type DesignTokens = typeof designTokens;

/**
 * Helper function to get nested token values
 */
export function getToken<K extends keyof DesignTokens>(
  category: K,
  key: string
): string {
  const tokens = designTokens[category] as Record<string, any>;
  return tokens[key] || '';
}

/**
 * Export individual token categories for convenience
 */
export const {
  colors,
  typography,
  spacing,
  borderRadius,
  effects,
  transitions,
  zIndex,
  breakpoints,
  touchTargets,
  containers,
  gridPattern,
} = designTokens;
