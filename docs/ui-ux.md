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
├── /ar-game (AR Target Drop Landing)
│   └── /ar-game/play (Active AR Game Session)
├── /ar-demo (AR Demo Landing)
│   └── /ar-demo/play (Active AR Demo Session)
├── /christmas-lab (Christmas Tools)
└── /profile (Player Profile)
```

### Route → Component → Engine Mapping

#### AR Game Routes

1. **AR Game Landing** (`/ar-game`)
   - **Component**: `src/pages/ARGame.tsx`
   - **Purpose**: Marketing/info page with game features and instructions
   - **AR Engine**: None (no AR initialization)
   - **Status**: ✅ Fully functional with cockpit theme
   - **Theme**: CockpitButton, CockpitPanel, CockpitContainer throughout

2. **AR Game Play** (`/ar-game/play`)
   - **Component**: `src/pages/ARGamePlay.tsx`
   - **AR Wrapper**: `src/components/ar/ARGameWrapper.tsx`
   - **AR Engine**: `src/components/ar/MockARGame.ts` (current) OR `src/samples/ar-mini-game/ARTargetDrop.ts` (future)
   - **Purpose**: Active AR game session with HUD and controls
   - **Status**: ✅ Fully functional with mock/simulator, real AR pending TypeScript config
   - **Theme**: Cockpit theme applied to HUD and error states
   - **Key Features**:
     - AR capability detection on mount
     - Mock game auto-places spawn pad after 3 seconds
     - Auto-scores points every 2 seconds (simulates hitting targets)
     - Game states: initializing → placing → playing → paused → game_over
     - Pause/Resume/Restart controls
     - Exit with confirmation
     - Cockpit-styled error page with retry functionality

3. **AR Demo Landing** (`/ar-demo`)
   - **Component**: `src/pages/ARDemo.tsx`
   - **Purpose**: Info page for simple cube placement demo
   - **AR Engine**: None (no AR initialization)
   - **Status**: ✅ Fully functional with cockpit theme
   - **Theme**: CockpitButton, CockpitPanel, CockpitContainer throughout

4. **AR Demo Play** (`/ar-demo/play`)
   - **Component**: `src/pages/ARDemoPlay.tsx`
   - **AR Wrapper**: `src/components/ar/ARDemoWrapper.tsx`
   - **AR Engine**: `src/components/ar/MockARDemo.ts` (current) OR `src/samples/ar-demo/PlaceCubeDemo.ts` (future)
   - **Purpose**: Simple AR demo - tap to place cubes (20 cube FIFO limit)
   - **Status**: ✅ Fully functional with mock/simulator, real AR pending TypeScript config
   - **Theme**: Cockpit theme applied to HUD and error states
   - **Key Features**:
     - Tap-to-place colorful cubes
     - FIFO removal when exceeding 20 cubes
     - Clear all cubes button
     - Cockpit-styled error page with retry functionality

### AR Integration Status

#### Current Implementation (December 2024)

**✅ Fully Implemented:**
- AR capability detection (`src/utils/arCapability.ts`)
- Automatic detection of WebXR AR support
- Graceful fallback to simulator mode when AR not available
- Clear user messaging about AR availability status
- Mock implementations provide functional demos
- Works in all browsers without AR hardware
- Demonstrates UI/UX patterns
- Cockpit HUD and controls fully functional
- Cockpit-themed error handling with retry functionality
- Comprehensive lifecycle management and cleanup

**🚧 In Progress:**
- Real AR engine integration (requires TypeScript config alignment)
- See `docs/ar-integration-roadmap.md` for detailed integration plan

#### AR Mode Switching Logic

The application uses automatic capability detection to determine whether to use real AR or simulator mode:

**1. Capability Detection** (`getARMode()`):
```typescript
// Checks performed:
- navigator.xr exists
- navigator.xr.isSessionSupported('immersive-ar')
- Returns: { mode: 'real' | 'mock', reason: string, supported: boolean }
- Override via VITE_FORCE_MOCK_AR environment variable
```

**2. User Experience Flow:**

```
User Navigation Flow:
/ar-game → /ar-game/play
             ↓
         ARGamePlay Component
             ↓
         Capability Detection
           ↙     ↘
    Real AR    Mock AR
    (future)   (current)
       ↓          ↓
    ARGameWrapper loads appropriate implementation
       ↓
    Session starts
       ↓
    Game plays with HUD controls
```

**Mode Indicators:**
- **Real AR Mode**: "✅ AR Hardware Detected - Running in AR Mode"
- **Simulator Mode**: "📱 AR Simulator Mode - AR hardware not detected"
- Badge displayed in AR session UI
- Automatic fallback with no user interaction required

**Error States:**
- Permission denied: Cockpit-themed error panel with retry button
- AR not supported: Clear requirements list with recommended devices
- Session initialization failed: Retry button available
- All errors use CockpitPanel with consistent styling

**3. Implementation Architecture:**

```
Detection Layer:
├── src/utils/arCapability.ts (AR mode detection)
│   ├── getARMode() - async capability check
│   ├── isWebXRAvailable() - sync quick check
│   └── getARAvailabilityMessage() - user-friendly messaging

Wrapper Layer:
├── src/components/ar/ARGameWrapper.tsx (Game orchestration)
├── src/components/ar/ARDemoWrapper.tsx (Demo orchestration)
│   ├── Lifecycle management (mount/unmount)
│   ├── Animation frame cleanup
│   ├── Error handling and recovery
│   └── HUD rendering and state management

Implementation Layer:
├── src/components/ar/MockARGame.ts (Current: Simulator)
├── src/components/ar/MockARDemo.ts (Current: Simulator)
└── src/samples/ (Future: Real AR engines)
    ├── ar-mini-game/ARTargetDrop.ts (Ready for integration)
    └── ar-demo/PlaceCubeDemo.ts (Ready for integration)

Page Layer:
├── src/pages/ARGamePlay.tsx (Error handling, routing)
└── src/pages/ARDemoPlay.tsx (Error handling, routing)
```

**4. Real vs Mock Behavior Comparison:**

| Feature | Mock Mode (Current) | Real AR Mode (Future) |
|---------|-------------------|---------------------|
| Camera Feed | Simulated viewport | Live camera feed via WebXR |
| Plane Detection | Auto after 3 seconds | Real surface detection |
| Object Placement | Simulated coordinates | Hit test against detected planes |
| Tracking | N/A | 6DOF camera tracking |
| Lighting | Static | Environment lighting estimation |
| Interaction | Click/tap simulation | Real-world spatial tap |
| Performance | Lightweight | Device/browser dependent |
| Availability | All devices | WebXR-capable devices only |
| User Experience | Identical UI/UX | Identical UI/UX |

**5. Integration Testing:**
- Unit tests: `tests/unit/utils/arCapability.test.ts` (13 tests)
- Mock game tests: Covered by existing test suite
- Real AR tests: Pending integration

#### Real AR Integration Path

**Option 1: TypeScript Configuration Alignment** (Recommended - 2-4 hours)
1. Update `tsconfig.app.json` to include AR samples
2. Fix type imports in AR sample files
3. Create adapter classes: `RealARGameAdapter`, `RealARDemoAdapter`
4. Update wrappers to instantiate real AR when `mode === 'real'`
5. Test on WebXR-capable device

**Option 2: Dynamic Import** (Alternative - 4-6 hours)
- Build AR samples separately
- Load dynamically at runtime with code splitting

**Option 3: WebXR Polyfill** (Complex - 6-8 hours)
- Single unified implementation
- Requires significant refactoring

See `docs/ar-integration-roadmap.md` for complete details.

### New AR Portal Routes (Detailed)

1. **AR Game Landing** (`/ar-game`)
   - Main entry point for AR Target Drop game
   - Clear explanation of what AR game is
   - Prominent "Launch AR Game" CTA
   - Device requirements and permissions info
   - How to play instructions
   - Does NOT initialize AR until user taps "Play"

2. **AR Demo Landing** (`/ar-demo`)
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

**Error States (Cockpit-Themed)**:

All error states now use the cockpit design system:
- CockpitPanel with outlined variant for error container
- Neon green (#00ff88) titles with glow effect
- Monospace "Courier New" typography
- Clear system requirements lists
- Prominent "RETRY AR SESSION" button
- "BACK TO BRIEFING" / "BACK TO LAB" navigation

**Error Scenarios:**
- **No camera**: "Camera required for AR experience"
- **AR not supported**: Clear device requirements + recommended hardware list
- **Permission denied**: "Please enable camera access" + retry option
- **Session initialization failed**: Generic error with retry capability
- **WebXR check failed**: Technical details logged, user-friendly message shown

**Error Page Layout:**
```
┌─────────────────────────────────────┐
│  CockpitPanel (outlined)            │
│  ┌───────────────────────────────┐  │
│  │ ⚠️ AR SESSION ERROR          │  │
│  │ [Error message here]          │  │
│  │                               │  │
│  │ SYSTEM REQUIREMENTS:          │  │
│  │ • AR-capable device          │  │
│  │ • WebXR browser              │  │
│  │ • HTTPS connection           │  │
│  │ • Camera permissions         │  │
│  │                               │  │
│  │ RECOMMENDED HARDWARE:         │  │
│  │ • iPad Pro/Air (iOS 13+)     │  │
│  │ • iPhone 6S+ (iOS 13+)       │  │
│  │ • Android with ARCore        │  │
│  │                               │  │
│  │ [🔄 RETRY AR SESSION]         │  │
│  │ [← BACK TO BRIEFING]          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

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
