# 🚀 Best Boys Lab - Frontier Tech Gaming & Exploration

A cutting-edge web application featuring logic games, AR experiences, and Christmas tools with a unified **frontier cockpit theme** - optimized for iPad and modern devices.

## 🌟 Features

### 🎯 AR Cockpit - Primary Mission
Experience the future of augmented reality gaming with our **Frontier Cockpit** interface:

#### AR Target Drop
A fully functional AR game with an immersive sci-fi HUD:
- **🎮 Cockpit HUD**: Futuristic interface with neon green (#00ff88) accents and glowing effects
- **🎯 AR Plane Detection**: Automatically detects flat surfaces in your environment
- **⚡ Real-time Gameplay**: Place spawn pad and tap targets to score points
- **🎛️ Game Controls**: Pause, resume, and restart with cockpit-style buttons
- **📊 Live Score Tracking**: Real-time display with glowing visual effects
- **📱 iPad Optimized**: Touch-friendly controls designed for tablet gaming
- **🌐 Responsive**: Works on mobile, tablet, and desktop devices
- **🛡️ Graceful Fallbacks**: Clear error messaging for unsupported devices

#### AR Demo
Simple demonstration of AR capabilities:
- Place colorful cubes in your environment
- Learn about plane detection and spatial anchors
- Perfect for first-time AR users

**Cockpit Design System:**
- Monospace "Courier New" font for tech aesthetic
- Neon green (#00ff88) primary color with glowing effects
- Dark space backgrounds with grid patterns
- Glowing borders and backdrop blur effects
- Pulsing animations for status messages
- Safe area insets for notched devices
- High contrast for visibility in various lighting

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

- **HTTPS**: Automatically provided by Vercel (required for camera features in "Find the Elves" game)
- **Camera Access**: Some features (AR elf hunting) require camera permissions
- **localStorage**: Required for saving progress and user data

## 📝 License

This project is part of the HendrixCode learning repository.
