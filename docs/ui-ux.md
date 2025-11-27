# UI/UX Architecture

## Overview

This document describes the user interface and user experience architecture for the Best Boys Lab application, with a focus on the AR game portal and iPad-first design principles.

## Information Architecture

### Primary Navigation Structure

```
/ (Home/Landing)
├── /players (Player Selection)
├── /play (Game Hub - Existing games)
├── /game/:gameId (Individual games)
├── /ar-game (AR Target Drop - NEW)
├── /ar-demo (AR Demo/Place Cube - NEW)
├── /christmas-lab (Christmas Tools)
└── /profile (Player Profile)
```

### New AR Portal Routes

1. **AR Game Landing** (`/ar-game`)
   - Main entry point for AR Target Drop game
   - Clear explanation of what AR game is
   - Prominent "Launch AR Game" CTA
   - Device requirements and permissions info
   - How to play instructions
   - Does NOT initialize AR until user taps "Play"

2. **AR Demo** (`/ar-demo`)
   - Simple AR cube placement demonstration
   - Educational/testing purposes
   - Basic AR interaction showcase

### Global Navigation

**Header Component** (shows on all pages except during active AR session):
- Logo/Home link
- Main sections: Games | AR Games | Christmas Lab
- Docs/Help link (optional)
- Player indicator (when logged in)

**Footer Component** (minimal, shows on landing pages):
- About
- Support/Help
- GitHub link (optional)

## Design System

### Core Principles

1. **Bright & Friendly**: Light backgrounds, clear color hierarchy, high contrast
2. **Touch-First**: All interactive elements ≥44x44px for comfortable touch
3. **Clear Affordances**: Obvious what to tap, clear visual feedback
4. **Minimal Friction**: Reduce steps between intent and action
5. **iPad-Optimized**: Works great in landscape and portrait

### Color Palette

```css
/* Primary Colors */
--primary: #4ecdc4;      /* Teal - primary actions */
--primary-dark: #3da39c; /* Darker teal - hover/active */
--secondary: #ff6b6b;    /* Coral - secondary actions */
--accent: #ffe66d;       /* Yellow - highlights */

/* Neutrals */
--background: #f8f9fa;   /* Light gray background */
--surface: #ffffff;      /* White cards/surfaces */
--text-primary: #2d3748; /* Dark gray text */
--text-secondary: #718096; /* Medium gray text */

/* Semantic Colors */
--success: #48bb78;      /* Green - success states */
--warning: #ed8936;      /* Orange - warnings */
--error: #f56565;        /* Red - errors */
--info: #4299e1;         /* Blue - info */
```

### Typography Scale

```css
/* Font Family */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               Oxygen, Ubuntu, Cantarell, sans-serif;

/* Font Sizes (optimized for arm's length on iPad) */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
--text-5xl: 3rem;     /* 48px */
```

### Component Library

Located in `src/components/ui/`:

1. **Button** (`Button.tsx`)
   - Variants: primary, secondary, ghost, danger
   - Sizes: small, medium, large
   - Touch-optimized (min 44px height)
   - Clear hover/active/disabled states

2. **Card** (`Card.tsx`)
   - Content container with shadow and border-radius
   - Variants: default, elevated, outlined
   - Supports header, body, footer slots

3. **Container** (`Container.tsx`)
   - Max-width responsive container
   - Padding management
   - Centered content layout

4. **Header** (`Header.tsx`)
   - Global navigation bar
   - Logo, navigation links, user info
   - Responsive (hamburger menu on mobile)

5. **LoadingSpinner** (`LoadingSpinner.tsx`)
   - Loading indicator for async operations
   - Used during AR initialization

6. **StatusMessage** (`StatusMessage.tsx`)
   - User feedback messages
   - Types: info, success, warning, error
   - Auto-dismiss option

## AR Game UI Flow

### 1. AR Game Landing Page (`/ar-game`)

**Purpose**: Introduce the AR Target Drop game and prepare user for AR experience

**Layout**:
```
┌─────────────────────────────────────┐
│ Header (Nav)                        │
├─────────────────────────────────────┤
│                                     │
│  Hero Section                       │
│  ┌─────────────────────────────┐   │
│  │ 🎯 AR Target Drop           │   │
│  │                             │   │
│  │ [Launch AR Game] (Primary)  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Features Grid                      │
│  ┌─────┐ ┌─────┐ ┌─────┐         │
│  │ AR  │ │Score│ │Tap  │         │
│  │Plane│ │Track│ │Hit  │         │
│  └─────┘ └─────┘ └─────┘         │
│                                     │
│  How to Play                        │
│  1. Allow camera access             │
│  2. Find a flat surface             │
│  3. Place spawn pad                 │
│  4. Tap targets to score            │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements**:
- Large hero image/video showing AR gameplay
- Prominent "Launch AR Game" button (primary CTA)
- Feature cards explaining game mechanics
- Requirements checklist (camera, device compatibility)
- How to play section with clear steps
- Back to main navigation

### 2. AR Game Session (In-Game)

**States**: PLACING → PLAYING → PAUSED → GAME_OVER

**HUD Overlay** (always visible during game):
```
┌─────────────────────────────────────┐
│ [X] Exit          Score: 1250  🎯  │ <- Header Bar
├─────────────────────────────────────┤
│                                     │
│   [AR Camera Feed/WebXR View]       │
│                                     │
│        (Game objects rendered)      │
│                                     │
│                                     │
│  [Status Message Area]              │ <- Center Bottom
│  "Tap to place spawn pad"           │
│  "Great shot! +50"                  │
│                                     │
└─────────────────────────────────────┘
```

**Status Messages** (context-aware):
- PLACING: "Move device to detect planes" → "Tap to place spawn pad"
- PLAYING: "Tap targets to score!" / "Great shot! +50"
- PAUSED: "Game Paused" with Resume/Exit buttons
- GAME_OVER: "Game Over! Score: 1250" with Replay/Exit buttons

**Controls**:
- Exit button (top-left): Returns to AR landing page
- Score display (top-right): Real-time score updates
- Pause button (optional): Pause game

### 3. AR Demo Page (`/ar-demo`)

**Purpose**: Simple demonstration of AR capabilities

**Layout**:
- Similar to AR game landing but simpler
- "Start AR Demo" button
- Instructions: "Tap to place cubes in AR"
- Shows basic plane detection and placement

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
```

### iPad Specific Optimizations

**Portrait** (768px width):
- Single column layouts
- Larger touch targets
- Bottom navigation accessible with thumb

**Landscape** (1024px width):
- Two-column layouts where appropriate
- Side navigation
- Optimized for AR (most AR interactions in landscape)

### Touch Target Guidelines

- Minimum size: 44x44px (iOS guidelines)
- Recommended size: 48x48px (Material Design)
- Spacing between targets: 8px minimum
- Primary actions: 56-64px tall

## AR-Specific Considerations

### Camera Permissions

**First-time Flow**:
1. User taps "Launch AR Game"
2. Show loading spinner with message "Initializing AR..."
3. Browser/app requests camera permission
4. If granted: Start AR session
5. If denied: Show friendly error with instructions

**Error States**:
- No camera: "Camera required for AR experience"
- AR not supported: "AR not supported on this device"
- Permission denied: "Please enable camera access in settings"

### Performance

- Lazy load AR libraries (only when needed)
- Preload critical assets
- Show loading states during initialization
- Smooth transitions between states
- Target 60fps during AR gameplay

### Orientation Handling

- Lock orientation to landscape during AR gameplay (iPad)
- Handle orientation changes gracefully
- Reflow UI elements on orientation change
- Preserve game state during orientation changes

## Accessibility

### ARIA Labels

- All interactive elements have descriptive labels
- Screen reader announcements for game state changes
- Keyboard navigation support where possible

### Visual Accessibility

- High contrast mode support
- Text resizing support
- Color blind friendly palette
- No reliance on color alone for information

## Implementation Files

### New Files to Create

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx & Button.css
│       ├── Card.tsx & Card.css
│       ├── Container.tsx & Container.css
│       ├── Header.tsx & Header.css
│       ├── LoadingSpinner.tsx & LoadingSpinner.css
│       └── StatusMessage.tsx & StatusMessage.css
├── pages/
│   ├── ARGame.tsx & ARGame.css (NEW)
│   └── ARDemo.tsx & ARDemo.css (NEW)
└── hooks/
    ├── useARSession.ts (NEW)
    └── useMediaQuery.ts (NEW)
```

### Files to Update

- `src/App.tsx`: Add new routes for AR pages
- `src/pages/Home.tsx`: Add AR Games section
- `src/index.css`: Add CSS variables and global styles
- `README.md`: Update with AR game documentation
- `docs/architecture.md`: Reference UI/UX architecture

## Future Enhancements

1. **Progressive Enhancement**: Fallback experiences for non-AR devices
2. **Onboarding Tutorial**: Interactive tutorial for first-time users
3. **Settings**: Allow users to customize controls, sensitivity, etc.
4. **Leaderboard**: Track high scores across sessions
5. **Multiplayer**: Collaborative or competitive AR experiences
6. **More AR Games**: Expand AR game library

## References

- [Apple Human Interface Guidelines - AR](https://developer.apple.com/design/human-interface-guidelines/arkit)
- [Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [WebXR Design Patterns](https://immersive-web.github.io/webxr-samples/)
