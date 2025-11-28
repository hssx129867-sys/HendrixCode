# 🚀 Best Boys Lab - Frontier Tech Gaming & Exploration

A cutting-edge web application featuring logic games, AR experiences, and Christmas tools with a unified **frontier cockpit theme** - optimized for iPad and modern devices.

## 🌟 Features

### 🎯 AR Cockpit - Primary Mission
Experience the future of augmented reality gaming with our **Frontier Cockpit** interface:

#### Routes
- **`/ar-game`**: AR Target Drop landing page with game information
- **`/ar-game/play`**: Active AR Target Drop game session
- **`/ar-demo`**: AR Demo landing page with demonstration info
- **`/ar-demo/play`**: Active AR cube placement demo session

#### AR Target Drop (`/ar-game/play`)
A fully functional AR game with an immersive sci-fi HUD:
- **🎮 Cockpit HUD**: Futuristic interface with neon green (#00ff88) accents and glowing effects
- **🎯 Mock AR Simulation**: Demonstrates full game flow (WebXR integration in progress)
- **⚡ Real-time Gameplay**: Auto-placement of spawn pad, target spawning, and scoring
- **🎛️ Game Controls**: Pause, resume, restart, and exit with cockpit-style buttons
- **📊 Live Score Tracking**: Real-time display with glowing visual effects
- **📱 iPad Optimized**: Touch-friendly controls designed for tablet gaming
- **🌐 Responsive**: Works on mobile, tablet, and desktop devices
- **🛡️ Graceful Fallbacks**: Clear error messaging for unsupported devices

#### AR Demo (`/ar-demo/play`)
Simple demonstration of AR capabilities:
- **🎲 Interactive Cube Placement**: Tap anywhere to place colorful cubes
- **📐 Plane Detection Simulation**: Learn about AR surface detection concepts
- **⚓ Spatial Anchors**: See how virtual objects lock to positions
- **🗑️ Clear Function**: Remove all placed cubes with one tap
- **Perfect for first-time AR users**: Simple, intuitive interaction

**Current Implementation:**
Both AR experiences intelligently detect device capabilities and automatically choose between real AR mode (when WebXR is supported) and simulator mode. The application uses `MockARGame` and `MockARDemo` implementations that demonstrate the full UI/UX flow and game mechanics without requiring AR hardware.

**AR Capability Detection:**
- ✅ Automatic WebXR AR detection on device
- ✅ Clear user messaging about AR availability
- ✅ "AR Hardware Detected" when real AR is available
- ✅ "AR Simulator Mode" fallback for non-AR devices
- ✅ Seamless experience regardless of device capabilities
- 🚧 Real AR engine at `src/samples/` ready for integration (see [AR Integration Roadmap](./docs/ar-integration-roadmap.md))

**AR Integration Status:**
- Mock implementations fully functional and demonstrate complete AR game flow
- Real AR engine (ARTargetDrop, PlaceCubeDemo) exists and is functional
- TypeScript configuration update needed to integrate real AR into React app
- See `docs/ar-integration-roadmap.md` for detailed integration steps

**Cockpit Design System:**
- Unified navigation across all pages (`CockpitNav` component)
- Monospace "Courier New" font for tech aesthetic
- Neon green (#00ff88) primary color with glowing effects
- Dark space backgrounds with grid patterns
- Glowing borders and backdrop blur effects
- Pulsing animations for status messages
- Safe area insets for notched devices
- High contrast for visibility in various lighting
- Reusable components: `CockpitButton`, `CockpitPanel`, `CockpitContainer`, `CockpitNav`
- Comprehensive design tokens for consistent theming

### 🎮 Game Zone
Classic logic games and challenges:
- **Player Profiles**: Create and manage multiple player profiles with custom avatars
- **Mini-Games**:
  - 🎨 **Pattern Builder**: Match color sequences to build pattern recognition
  - 🐛 **Bug Squash**: Click bugs that match logical rules
  - 🧭 **Logic Path**: Navigate through grids using directional commands
  - 🧠 **Brain Rot**: Build your brain empire with incremental gameplay
- **Progress Tracking**: Earn stars and track levels completed

### 🎄 Christmas Lab
Holiday tools and festive activities:
- **Christmas List**: Create and manage your Christmas wish list with priorities
- **Santa Tracker**: See where Santa is right now with real-time updates
- **Christmas Jokes**: Enjoy 12 kid-friendly Christmas jokes
- **Break Ideas**: Get 20+ fun Christmas activity ideas with progress tracking
- **Find the Elves**: Hunt for 12 hidden elves using AR camera or manual mode
- **Santa Countdown**: Track days until Christmas

### 💾 Storage
- All progress and lists are saved automatically in your browser
- AR photos captured during elf hunting are stored locally with your progress

### 📷 AR Camera Features
The "Find the Elves" game now includes AR (Augmented Reality) camera functionality:
- **AR Hunt Mode**: Use your device's camera to hunt for elves in real-world environments
- **Camera Switching**: Toggle between front and back cameras
- **Photo Capture**: Take photos when you find elves to save the moment
- **AR Overlay**: Visual indicators and hints displayed over the camera feed
- **Permission Handling**: Graceful error handling for camera permissions
- **Manual Mode**: Still supports the original manual "Found It" mode without camera access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at http://localhost:5173

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
# Run tests once
npm test -- --run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

The test suite includes:
- **Unit tests**: AR capability detection, math utilities, ECS system (47 tests)
- **Integration tests**: Component lifecycle and interactions
- **Coverage**: Core AR detection logic and game systems

## 🎯 How to Use

### Game Zone
1. **Choose Your Player**: Select from the default players or create a new one
2. **Pick a Game**: Choose from Pattern Builder, Bug Squash, or Logic Path
3. **Play and Earn Stars**: Complete levels to earn stars and track your progress
4. **View Your Profile**: Check your total stars and levels completed

### Christmas Lab
1. **Create Your List**: Add items to your Christmas wish list
2. **Track Christmas**: See how many days until Christmas
3. **Find the Elves**: Use AR camera to hunt for 12 elves in your house, or mark them manually
   - Click on an elf to see their location hint
   - Choose "📷 AR Hunt" to use your camera for an immersive experience
   - Choose "🎁 Found It!" to mark them as found manually
   - View captured AR photos in the elf cards after finding them
4. **Share with Santa**: Print or share your list

## 🛠 Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Design System**: Custom cockpit-themed components
  - CockpitButton, CockpitPanel, CockpitContainer
  - Reusable UI primitives with consistent theming
- **CSS Variables**: Centralized design tokens
- **localStorage** for persistence
- **WebXR Ready**: Foundation for future AR integration

## 🎨 Design System

### Cockpit Theme
The app features a unified **Frontier Cockpit** design system:

**Color Palette:**
- Primary: Cockpit Green `#00ff88`
- Background: Dark Space `#0a1f35` to `#0f1419`
- Accents: Light Green `#a0ffd0`
- Effects: Glowing shadows and borders

**Typography:**
- Primary Font: Courier New (monospace)
- Letter Spacing: 2px for tech aesthetic
- Text Shadows: Glowing green effects

**Components:**
- Buttons: Glowing borders, backdrop blur, hover effects
- Panels: HUD-style cards with transparency and pulse animations
- Containers: Responsive max-width layouts
- Grid Backgrounds: Subtle animated patterns

**Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 641px - 1024px (iPad optimized)
- Desktop: > 1024px

### Accessibility
- Touch targets: Minimum 44x44px (iOS guidelines)
- High contrast mode support
- Reduced motion preferences respected
- Keyboard navigation support
- ARIA labels for screen readers

## 📱 iPad-First Design

- Large, finger-friendly touch targets
- Landscape and portrait optimizations
- Safe area insets for notched devices
- High contrast for outdoor visibility
- Simple, clear navigation
- Minimal friction between intent and action

## 🚀 Deployment

This app is designed to deploy seamlessly to **Vercel**.

### Quick Deploy to Vercel

1. **Import Repository**: Go to [Vercel](https://vercel.com) and import your GitHub repository
2. **Auto-Detection**: Vercel will automatically detect the Vite framework configuration
3. **Configure Build Settings** (optional, already configured in `vercel.json`):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Deploy**: Click "Deploy" and your app will be live in minutes!

### Manual Configuration

If needed, the repository includes a `vercel.json` configuration file with:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing support (all routes redirect to `index.html`)

### Local Preview

To preview the production build locally:

```bash
npm run build
npm run preview
```

This will serve the built app at http://localhost:4173

### Browser Requirements

The app works on all modern browsers:
- Chrome, Edge, Firefox, Safari (latest versions)
- Mobile browsers (iOS Safari, Chrome for Android)
- Tablets and desktops

### Environment Requirements

- **HTTPS**: Automatically provided by Vercel (required for camera features and WebXR)
- **Camera Access**: AR features require camera permissions
- **localStorage**: Required for saving progress and user data

## 🧪 Testing AR Features

### Manual QA Instructions

#### Testing on WebXR-Capable Devices

**Recommended Devices:**
- iPad Pro or iPad Air (iOS 13+) with Safari
- iPhone 6S or newer (iOS 13+) with Safari
- Android phones with ARCore support using Chrome

**Test Steps:**
1. **Deploy to HTTPS Environment**
   - Deploy to Vercel or use local HTTPS (AR requires secure context)
   - Access the deployment URL on your test device

2. **Test AR Game (/ar-game/play)**
   ```
   1. Navigate to /ar-game/play
   2. Grant camera permissions when prompted
   3. Observe AR capability detection message
   4. On WebXR devices: Verify "AR Hardware Detected" message
   5. On non-AR devices: Verify "AR Simulator Mode" message
   6. Check that game initializes without errors
   7. Verify HUD controls are visible and functional
   8. Test pause, resume, restart, and exit controls
   9. Verify score tracking works correctly
   10. Check cleanup when exiting (no console errors)
   ```

3. **Test AR Demo (/ar-demo/play)**
   ```
   1. Navigate to /ar-demo/play
   2. Grant camera permissions when prompted
   3. Verify capability detection works
   4. Test tap-to-place cube functionality
   5. Place multiple cubes (verify FIFO limit of 20)
   6. Test clear button
   7. Verify smooth animation and rendering
   8. Check cleanup when exiting
   ```

4. **Test Fallback Behavior**
   ```
   1. Test on desktop browser (should show simulator mode)
   2. Deny camera permissions (should show clear error)
   3. Test on non-WebXR browser (should fall back gracefully)
   4. Verify retry button works after errors
   ```

#### Testing on Desktop (Simulator Mode)

1. Open the app in Chrome/Firefox/Safari on desktop
2. Navigate to AR routes - should automatically use simulator mode
3. Verify all game mechanics work without camera
4. Check that error messages are appropriate for desktop testing

### Current Test Coverage

```bash
npm run test        # Run all tests
npm run test:ui     # Open test UI
npm run test:coverage  # Generate coverage report
```

**Test Suite Includes:**
- ✅ AR capability detection (13 tests)
- ✅ Math utilities and Vector3 operations (20 tests)
- ✅ ECS system architecture (14 tests)
- 🚧 AR wrapper lifecycle tests (planned)
- 🚧 Real AR integration tests (planned)

**Total:** 47 passing tests

### Known Test Gaps
- AR wrapper mount/unmount lifecycle
- Error handling in AR initialization
- Mode switching (real vs mock)
- Cleanup verification (animation frames, listeners)

## 📝 License

This project is part of the HendrixCode learning repository.
