# Frontier Cockpit Design System

A futuristic, space-tech themed UI design system for the AR Target Drop game and related experiences.

## Design Philosophy

The Frontier Cockpit design system creates an immersive, sci-fi gaming experience that feels like stepping into a spacecraft control interface. The design emphasizes:

- **High contrast**: Bright neon elements on dark backgrounds for visibility in various lighting conditions
- **Legibility**: Clear typography and generous spacing for quick reading
- **Tactile feedback**: Glowing effects and animations that respond to user interaction
- **iPad-first**: Touch-friendly controls optimized for tablet gaming
- **Futuristic aesthetic**: Monospace fonts, glowing borders, and HUD-style panels

## Color Palette

### Primary Colors

- **Cockpit Green** (`#00ff88`): Primary accent color, used for interactive elements, borders, and highlights
- **Dark Space** (`#0a0a0a`): Main background color
- **Deep Ocean** (`rgba(0, 20, 40, 0.85)`): Panel backgrounds with transparency
- **Light Green** (`#a0ffd0`): Secondary text color

### Semantic Colors

- Success: `#00ff88` (same as primary)
- Warning: Inherited from base theme
- Error: Inherited from base theme
- Info: `#00ff88`

### Transparency Values

- Panels: `0.5` to `0.9` alpha
- Buttons: `0.2` to `0.3` alpha for background
- Overlays: `0.7` alpha

## Typography

### Font Family

- **Primary**: `'Courier New', monospace` - Used for all cockpit UI elements
- **Fallback**: System monospace fonts

### Font Sizes

Cockpit UI uses uppercase text and slightly increased letter-spacing for the tech aesthetic:

- Labels: `0.75rem` with `letter-spacing: 2px`
- Body: `1rem` to `1.125rem`
- Headings: `1.25rem` to `3rem`
- Hero text: `3rem` to `5rem`

### Text Shadow

All text in the cockpit theme uses a glowing effect:
```css
text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
```

## Components

### Buttons

#### Cockpit Button (`.ar-hud-button`)

**Characteristics:**
- Transparent background with glowing border
- Monospace font
- Text shadow for glow effect
- Box shadow with both outer glow and inner highlight
- Smooth hover transitions

**Variants:**
- **Default**: Transparent bg, green border
- **Primary** (`.ar-hud-button--primary`): More prominent glow
- **Exit** (`.ar-hud-button--exit`): Circular, top-left position
- **Control** (`.ar-hud-button--control`): Bottom controls for gameplay

**States:**
- **Hover**: Brighter background, increased glow, slight upward movement
- **Active**: Returns to base position, intensified inner glow
- **Disabled**: Reduced opacity (inherited from base system)

```css
/* Example */
.ar-hud-button {
  background: rgba(0, 20, 40, 0.8);
  border: 2px solid #00ff88;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  box-shadow: 
    0 0 15px rgba(0, 255, 136, 0.2),
    inset 0 0 10px rgba(0, 255, 136, 0.1);
}
```

### Panels

#### HUD Panel (`.ar-hud-status`, `.ar-hud-score`)

**Characteristics:**
- Semi-transparent dark background
- Glowing green border
- Backdrop blur effect
- Subtle pulsing animation
- Inner and outer box shadows

```css
.ar-hud-status {
  background: rgba(0, 20, 40, 0.9);
  border: 2px solid #00ff88;
  border-radius: 12px;
  box-shadow: 
    0 0 30px rgba(0, 255, 136, 0.4),
    inset 0 0 20px rgba(0, 255, 136, 0.1);
  backdrop-filter: blur(15px);
  animation: pulse 2s ease-in-out infinite;
}
```

#### Feature Cards

Cards with hover effects that increase glow:

```css
.ar-feature-card {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 255, 136, 0.3);
  transition: all 0.3s ease;
}

.ar-feature-card:hover {
  border-color: rgba(0, 255, 136, 0.6);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
  transform: translateY(-4px);
}
```

### Score Display

The score display is a key HUD element:

```css
.ar-hud-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 20, 40, 0.85);
  border: 2px solid #00ff88;
  min-width: 100px;
}

.ar-hud-score__label {
  font-size: 0.75rem;
  letter-spacing: 2px;
  opacity: 0.8;
}

.ar-hud-score__value {
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
}
```

## Layouts

### Grid Background Pattern

An optional subtle grid pattern can be applied to backgrounds:

```css
.background-with-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      90deg,
      rgba(0, 255, 136, 0.03) 0px,
      transparent 2px,
      transparent 40px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(0, 255, 136, 0.03) 0px,
      transparent 2px,
      transparent 40px
    );
  pointer-events: none;
}
```

### HUD Layout

The AR game HUD uses absolute positioning with safe area insets:

- **Top Bar**: Exit button (left), Score (right), Minimize toggle
- **Center**: Status message with icon
- **Bottom**: Context-sensitive control buttons

## Animations

### Pulse Animation

Used for status messages and important UI elements:

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
```

### Float Animation

For icons and hero elements:

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

## Responsive Design

### Breakpoints

- **Mobile**: `< 640px`
- **Tablet Portrait**: `641px - 1024px` (portrait orientation)
- **Tablet Landscape**: `641px+` (landscape orientation)
- **Desktop**: `1024px+`

### iPad Optimization

Special considerations for iPad devices:

- Minimum touch target: 44px × 44px
- Controls positioned in thumb-friendly zones
- Landscape mode optimizations for wider aspect ratio
- Safe area insets for notched devices

```css
@supports (padding: env(safe-area-inset-top)) {
  .ar-hud-top {
    padding-top: max(1.5rem, env(safe-area-inset-top));
  }
}
```

## Accessibility

### Reduced Motion

Respects user preference for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .ar-hud-status {
    animation: none;
  }
  .ar-hud-button {
    transition: none;
  }
}
```

### High Contrast

Supports high contrast mode:

```css
@media (prefers-contrast: high) {
  .ar-hud-button,
  .ar-hud-score {
    border-width: 3px;
  }
}
```

## Usage Examples

### Creating a Cockpit-Themed Page

```jsx
<div className="cockpit-page">
  <div className="cockpit-hero">
    <h1 className="cockpit-title">Mission Control</h1>
    <button className="ar-launch-button">
      🚀 Launch Cockpit
    </button>
  </div>
</div>
```

```css
.cockpit-page {
  background: linear-gradient(135deg, #0a1f35 0%, #1a0f2e 50%, #0f1419 100%);
  color: #00ff88;
  font-family: 'Courier New', monospace;
}

.cockpit-title {
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
  letter-spacing: 2px;
}

.ar-launch-button {
  background: rgba(0, 255, 136, 0.2);
  border: 2px solid #00ff88;
  color: #00ff88;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}
```

## Future Enhancements

Potential additions to the design system:

1. **Loading States**: Scanline loading animations
2. **Notifications**: Toast-style alerts with cockpit theme
3. **Forms**: Cockpit-styled form inputs
4. **Data Visualization**: HUD-style charts and graphs
5. **Sound Effects**: Beeps and clicks for interactions
6. **Targeting Reticle**: Animated crosshair overlay

## File Structure

```
src/
├── components/
│   └── ar/
│       ├── ARGameWrapper.tsx      # Main HUD component
│       └── ARGameWrapper.css      # Cockpit theme styles
├── pages/
│   ├── ARGame.tsx                 # Launcher page
│   ├── ARGame.css                 # Launcher styles
│   ├── ARGamePlay.tsx             # Game session
│   └── ARGamePlay.css             # Session styles
└── index.css                      # Base theme tokens
```

## Design Tokens

Core values that can be extracted into CSS variables:

```css
:root {
  --cockpit-green: #00ff88;
  --cockpit-green-light: #a0ffd0;
  --cockpit-dark: rgba(0, 20, 40, 0.85);
  --cockpit-glow: 0 0 20px rgba(0, 255, 136, 0.3);
  --cockpit-font: 'Courier New', monospace;
  --cockpit-letter-spacing: 2px;
}
```

## Conclusion

The Frontier Cockpit design system creates a cohesive, immersive experience that makes users feel like they're operating advanced AR technology. The consistent use of neon green accents, glowing effects, and monospace typography establishes a strong visual identity that differentiates the AR gaming experience from the rest of the application.
