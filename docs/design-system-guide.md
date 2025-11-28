# Design System - Comprehensive Guide

## Overview

The Best Boys Lab application uses a **Frontier Cockpit** design system that provides a unified, futuristic aesthetic across all pages, with particular emphasis on the AR gaming experiences. The design system consists of design tokens, reusable components, and consistent styling patterns.

## Design Tokens

### Location
`src/design-system/tokens.ts`

### Usage
```typescript
import { colors, typography, spacing, effects } from '../design-system';

// Use in code
const buttonStyle = {
  color: colors.cockpitGreen,
  fontFamily: typography.fontPrimary,
  padding: spacing['4'],
  boxShadow: effects.shadowGlow.base,
};
```

### Token Categories

#### Colors
- **Primary**: `cockpitGreen` (#00ff88), `cockpitGreenLight` (#a0ffd0)
- **Backgrounds**: `darkSpace` (#0a0a0a), `deepOcean` (rgba with transparency)
- **Gradients**: `gradientStart`, `gradientMid`, `gradientEnd`
- **Semantic**: `success`, `warning`, `error`, `info`

#### Typography
- **Font Family**: `'Courier New', monospace`
- **Sizes**: xs (12px) → 5xl (48px)
- **Weights**: normal (400) → extrabold (800)
- **Letter Spacing**: normal (2px) for tech aesthetic

#### Spacing
Based on 0.25rem (4px) increments:
- 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20

#### Effects
- **Shadow Glow**: Glowing box shadows in cockpit green
- **Shadow Inset**: Inner glows for depth
- **Text Glow**: Text shadows for glowing text effect
- **Backdrop Blur**: blur(5px) → blur(20px)

#### Transitions
- **Duration**: fast (150ms), base (300ms), slow (500ms)
- **Easing**: linear, in, out, inOut

#### Touch Targets
- **min**: 44px (iOS minimum)
- **recommended**: 48px (Material Design)
- **large**: 56px, **xl**: 64px (hero CTAs)

## Components

### CockpitButton

**Location**: `src/design-system/CockpitButton.tsx`

**Variants**:
- `default`: Standard cockpit button with green glow
- `primary`: Enhanced glow for primary actions
- `danger`: For destructive actions (future)

**Sizes**:
- `small`: Compact button for secondary actions
- `medium`: Standard button size (default)
- `large`: Hero buttons and primary CTAs

**Example**:
```tsx
import { CockpitButton } from '../design-system';

<CockpitButton variant="primary" size="large" onClick={handleClick}>
  🚀 LAUNCH COCKPIT
</CockpitButton>
```

**Features**:
- Glowing green borders
- Transparent background with backdrop blur
- Hover effects with increased glow
- Touch-optimized (min 44px height)
- Uppercase text with letter spacing

### CockpitPanel

**Location**: `src/design-system/CockpitPanel.tsx`

**Variants**:
- `default`: Basic panel
- `outlined`: Panel with visible border
- `elevated`: Panel with shadow and stronger glow

**Props**:
- `glow`: Adds extra glow effect
- `pulse`: Adds pulsing animation
- `fullWidth`: Expands to full container width

**Sub-components**:
- `CockpitPanelHeader`: Header section
- `CockpitPanelBody`: Main content area
- `CockpitPanelFooter`: Footer section

**Example**:
```tsx
import { CockpitPanel, CockpitPanelBody } from '../design-system';

<CockpitPanel variant="elevated" glow pulse>
  <CockpitPanelBody>
    <h2>Mission Status</h2>
    <p>All systems operational</p>
  </CockpitPanelBody>
</CockpitPanel>
```

**Features**:
- Semi-transparent backgrounds
- Glowing borders in cockpit green
- Backdrop blur effects
- Optional pulsing animation
- Inner and outer box shadows

### CockpitContainer

**Location**: `src/design-system/CockpitContainer.tsx`

**Sizes**:
- `sm`: 640px max width
- `md`: 768px max width
- `lg`: 1024px max width
- `xl`: 1280px max width
- `2xl`: 1536px max width

**Example**:
```tsx
import { CockpitContainer } from '../design-system';

<CockpitContainer size="lg">
  {/* Your content */}
</CockpitContainer>
```

**Features**:
- Responsive max-width layouts
- Centered content
- Consistent padding
- Safe area support for notched devices

## Styling Patterns

### Page Background

All cockpit-themed pages use this pattern:

```css
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1f35 0%, #1a0f2e 50%, #0f1419 100%);
  position: relative;
  color: var(--cockpit-green);
  font-family: var(--cockpit-font);
}

/* Animated grid background */
.page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(90deg, rgba(0, 255, 136, 0.03) 0px, transparent 2px, transparent 40px),
    repeating-linear-gradient(0deg, rgba(0, 255, 136, 0.03) 0px, transparent 2px, transparent 40px);
  pointer-events: none;
  z-index: 0;
}

.page > * {
  position: relative;
  z-index: 1;
}
```

### Typography

```css
h1, h2, h3 {
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}

p {
  font-family: 'Courier New', monospace;
  color: rgba(0, 255, 136, 0.9);
  line-height: 1.6;
}
```

### Glowing Elements

```css
.glowing-element {
  border: 2px solid #00ff88;
  box-shadow: 
    0 0 20px rgba(0, 255, 136, 0.3),
    inset 0 0 15px rgba(0, 255, 136, 0.1);
  backdrop-filter: blur(10px);
}
```

### Pulsing Animation

```css
@keyframes pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(0, 255, 136, 0.4),
      inset 0 0 20px rgba(0, 255, 136, 0.1);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(0, 255, 136, 0.6),
      inset 0 0 25px rgba(0, 255, 136, 0.15);
  }
}

.pulsing {
  animation: pulse 2s ease-in-out infinite;
}
```

## Accessibility

### Touch Targets
All interactive elements meet or exceed iOS touch target guidelines:
- Minimum: 44x44px
- Recommended: 48x48px
- Primary actions: 56-64px

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .cockpit-button,
  .cockpit-panel {
    border-width: 3px;
  }
}
```

### Safe Areas
```css
@supports (padding: env(safe-area-inset-top)) {
  .header {
    padding-top: max(1.5rem, env(safe-area-inset-top));
  }
}
```

## Responsive Breakpoints

```typescript
// From tokens.ts
breakpoints: {
  sm: '640px',   // Small devices (phones)
  md: '768px',   // Medium devices (tablets portrait)
  lg: '1024px',  // Large devices (tablets landscape, laptops)
  xl: '1280px',  // Extra large devices (desktops)
  '2xl': '1536px', // 2X large devices (large desktops)
}
```

### Usage in CSS
```css
/* Mobile first */
.element {
  padding: 1rem;
}

/* Tablet portrait */
@media (min-width: 768px) {
  .element {
    padding: 1.5rem;
  }
}

/* Tablet landscape / Desktop */
@media (min-width: 1024px) {
  .element {
    padding: 2rem;
  }
}

/* iPad specific */
@media (min-width: 1024px) and (orientation: landscape) {
  .element {
    /* iPad landscape optimizations */
  }
}
```

## Best Practices

### DO ✅
- Use design tokens instead of hardcoded values
- Apply cockpit theme to new pages for consistency
- Use CockpitButton, CockpitPanel, CockpitContainer components
- Ensure minimum 44px touch targets
- Add glowing effects to interactive elements
- Use monospace fonts for tech aesthetic
- Include safe area insets for notched devices

### DON'T ❌
- Don't use different font families on cockpit-themed pages
- Don't use colors outside the cockpit palette
- Don't hardcode spacing values (use tokens)
- Don't create buttons smaller than 44px
- Don't forget to test on iPad in both orientations
- Don't remove accessibility features

## Examples

### Full Page Example
```tsx
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';

export const MyPage = () => {
  return (
    <div className="my-page">
      <div className="my-page-hero">
        <CockpitContainer size="lg">
          <h1 className="hero-title">MY MISSION</h1>
          <p className="hero-subtitle">FRONTIER TECH • COCKPIT INTERFACE</p>
        </CockpitContainer>
      </div>

      <CockpitContainer size="lg">
        <CockpitPanel variant="elevated" glow>
          <CockpitPanelBody>
            <h2>MISSION BRIEFING</h2>
            <p>Description here...</p>
            <CockpitButton variant="primary" size="large">
              🚀 BEGIN MISSION
            </CockpitButton>
          </CockpitPanelBody>
        </CockpitPanel>
      </CockpitContainer>
    </div>
  );
};
```

### Corresponding CSS
```css
.my-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1f35 0%, #1a0f2e 50%, #0f1419 100%);
  color: var(--cockpit-green);
  font-family: var(--cockpit-font);
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
  letter-spacing: 2px;
}

.hero-subtitle {
  color: rgba(0, 255, 136, 0.9);
  letter-spacing: 1px;
}
```

## Future Enhancements

Planned additions to the design system:
1. **Form Components**: Text inputs, selects, checkboxes with cockpit styling.
2. **Modal/Dialog**: Cockpit-themed modal dialogs.
3. **Toast Notifications**: HUD-style notifications.
4. **Loading States**: Scanline loading animations.
5. **Data Visualization**: Charts and graphs with cockpit aesthetic.
6. **Navigation**: Shared nav/header component.
7. **Icons**: Custom icon set matching cockpit theme.

## Resources

- Main page implementation: `src/pages/Home.tsx`, `src/pages/Home.css`
- AR game pages: `src/pages/ARGame.tsx`, `src/pages/ARGamePlay.tsx`
- AR demo pages: `src/pages/ARDemo.tsx`, `src/pages/ARDemoPlay.tsx`
- Design tokens: `src/design-system/tokens.ts`
- Components: `src/design-system/`
- Documentation: `docs/cockpit-design-system.md`, `docs/ui-ux.md`
