# 🎮 Best Boys Lab - Kid-Friendly Games & Christmas Tools

A fun, educational web app for kids ages 7-10 featuring logic games and Christmas tools!

## 🌟 Features

### 🎮 Game Zone
- **Player Profiles**: Create and manage multiple player profiles with custom avatars and favorite colors
- **Three Fun Mini-Games**:
  - 🎨 **Pattern Builder**: Match color sequences to build pattern recognition skills
  - 🐛 **Bug Squash**: Click bugs that match logical rules (even/odd, greater than/less than)
  - 🧭 **Logic Path**: Navigate a character through a grid using directional commands
- **Progress Tracking**: Earn stars and track levels completed for each game

### 🎄 Christmas Lab
- **Christmas List**: Create and manage your Christmas wish list
- **Santa Countdown**: Track days until Christmas
- More Christmas tools coming soon!

### 💾 Storage
- All progress and lists are saved automatically in your browser

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
3. **Share with Santa**: Print or share your list

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

This app is designed to deploy seamlessly to Vercel:

1. Import the repository in Vercel
2. Vercel will auto-detect the Vite configuration
3. Deploy with default settings

The app uses a `vercel.json` configuration for proper SPA routing.

## 📝 License

This project is part of the HendrixCode learning repository.
