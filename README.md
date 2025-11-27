# 🎮 Best Boys Lab - Kid-Friendly Games & Christmas Tools

A fun, educational web app for kids ages 7-10 featuring logic games, AR experiences, and Christmas tools!

## 🌟 Features

### 🎮 Game Zone
- **Player Profiles**: Create and manage multiple player profiles with custom avatars and favorite colors
- **Four Fun Mini-Games**:
  - 🎨 **Pattern Builder**: Match color sequences to build pattern recognition skills
  - 🐛 **Bug Squash**: Click bugs that match logical rules (even/odd, greater than/less than)
  - 🧭 **Logic Path**: Navigate a character through a grid using directional commands
  - 🧠 **Brain Rot**: Build your brain empire! Click to collect brain cells, buy buildings that generate passive income, and unlock exciting areas including the mysterious Basement!
- **Progress Tracking**: Earn stars and track levels completed for each game

### 🎯 AR Games (NEW!)
Experience augmented reality gaming on your iPad or AR-capable device:
- **AR Target Drop**: A full AR game featuring plane detection, target spawning, and score tracking
  - Detect flat surfaces in your environment
  - Place a spawn pad on any horizontal plane
  - Tap targets to score points in real-time
  - Touch-optimized controls for iPad
- **AR Demo**: Simple demonstration of AR capabilities
  - Place colorful cubes in your environment
  - Learn about plane detection and spatial anchors
  - Perfect for first-time AR users

### 🎄 Christmas Lab
- **Christmas List**: Create and manage your Christmas wish list with priorities
- **Santa Tracker**: See where Santa is right now with real-time updates
- **Christmas Jokes**: Enjoy 12 kid-friendly Christmas jokes
- **Break Ideas**: Get 20+ fun Christmas activity ideas with progress tracking
- **Find the Elves**: Hunt for 12 hidden elves around your house using AR camera or manual mode, and collect stars for your Christmas tree
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
- **CSS** for styling (no frameworks, kid-friendly design)
- **localStorage** for persistence

## 📱 Kid-Friendly Design

- Large, colorful buttons
- High contrast for readability
- Simple, encouraging language
- Safe, offline-only (no ads, no chat, no external links)
- Responsive design for tablets and desktops

## 🎨 Default Players

The app comes with three default players:
- **Hendrix** (🚀 Rocket avatar)
- **Isaac** (🤖 Robot avatar)
- **Hendrix** (⭐ Star avatar)

More players can be added with custom names, colors, and avatars!

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
