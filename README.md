# FightingApp — React Native Cross-Platform Template

A production-ready React Native template built with **Expo** for building cross-platform iOS & Android apps.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/client) app on your phone (for quick testing)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Install dependencies

```bash
bun install
```

### Run the app

#### Expo Go (physical device — scan QR code)

```bash
bun run start
```

Opens the Expo dev server. Scan the QR code with the **Expo Go** app (iOS / Android) to launch instantly on your device.

#### Web (browser)

```bash
bun run web
```

Opens the app in your default browser via Expo's web support.

#### iOS Simulator (macOS + Xcode required)

```bash
bun run ios
```

Builds and launches the app in the iOS Simulator. Make sure Xcode and its Command Line Tools are installed.

To target a specific simulator:

```bash
bunx expo run:ios --device "iPhone 16 Pro"
```

#### Android Emulator (Android Studio required)

```bash
bun run android
```

Builds and launches the app in an Android Virtual Device (AVD). Make sure Android Studio is installed and an AVD is running before executing this command.

To target a specific device or emulator:

```bash
bunx expo run:android --device
```

#### Physical Android device (USB)

Enable **Developer Options** and **USB Debugging** on your device, connect via USB, then run:

```bash
bunx expo run:android --device
```

#### Tunnel mode (useful behind firewalls / NAT)

```bash
bun run start --tunnel
```

Exposes the dev server through a public URL so any device on any network can connect.

---

## 📁 Project Structure

```
FightingApp/
├── App.tsx                    # Root entry point
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Stack + Bottom Tab navigation
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Dashboard with hero, actions, stats
│   │   ├── ExploreScreen.tsx  # Search + category grid + trending
│   │   ├── ProfileScreen.tsx  # User profile + activity + badges
│   │   └── SettingsScreen.tsx # Settings with toggles
│   ├── components/
│   │   ├── Button.tsx         # Multi-variant button (primary/outline/ghost)
│   │   ├── Card.tsx           # Pressable card with header subcomponent
│   │   ├── Input.tsx          # Form input with label/error/icon support
│   │   └── index.ts           # Barrel exports
│   ├── theme/
│   │   └── index.ts           # Colors, Typography, Spacing, Radii, Shadows
│   ├── hooks/
│   │   ├── useToggle.ts       # Boolean toggle hook
│   │   └── useFetch.ts        # Generic async fetch hook
│   ├── utils/
│   │   └── index.ts           # Shared utility functions
│   └── types/
│       └── index.ts           # TypeScript types & navigation params
├── tsconfig.json              # Path aliases configured
└── package.json
```

---

## 🎨 Design System

The theme (`src/theme/index.ts`) provides:

| Token        | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `Colors`     | Dark-mode palette with primary (#FF4B2B), surfaces, text, status colors |
| `Typography` | Font sizes from `xs` (11) to `xxxl` (38)                                |
| `Spacing`    | 7-step scale from `xs` (4px) to `xxxl` (64px)                           |
| `Radii`      | Border radius presets from `xs` to `full`                               |
| `Shadows`    | `sm`, `md`, `lg` shadow presets                                         |

---

## 🧭 Navigation

Uses **React Navigation v7** with:

- `NativeStackNavigator` — root stack for screen transitions
- `BottomTabNavigator` — 4 main tabs (Home, Explore, Profile, Settings)

To add a new screen:

1. Create it in `src/screens/`
2. Add its type to `RootStackParamList` in `src/types/index.ts`
3. Register it in `src/navigation/AppNavigator.tsx`

---

## 🧩 Reusable Components

### `<Button />`

```tsx
<Button title='Click me' onPress={fn} variant='primary' size='md' />
// Variants: primary | secondary | outline | ghost
// Sizes: sm | md | lg
```

### `<Card />`

```tsx
<Card onPress={fn} elevated>
  <CardHeader title='Title' subtitle='Subtitle' />
  {/* content */}
</Card>
```

### `<Input />`

```tsx
<Input label='Email' placeholder='you@example.com' error={errorMsg} keyboardType='email-address' />
```

---

## 🪝 Custom Hooks

### `useToggle`

```ts
const { value: isOpen, toggle, setFalse: close } = useToggle(false);
```

### `useFetch<T>`

```ts
const { data, loading, error, refetch } = useFetch<User[]>(() =>
  fetch('https://api.example.com/users').then((r) => r.json()),
);
```

---

## 🛠 Next Steps

- [ ] Add authentication screens (Login / Register)
- [ ] Integrate a state manager (Zustand or Redux Toolkit)
- [ ] Add AsyncStorage or MMKV for local persistence
- [ ] Connect to your backend API
- [ ] Configure EAS Build for production builds

```bash
# Install EAS CLI for building production APK/IPA
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

---

## 📦 Key Dependencies

| Package                          | Purpose                      |
| -------------------------------- | ---------------------------- |
| `expo`                           | Cross-platform SDK           |
| `@react-navigation/native`       | Navigation                   |
| `@react-navigation/bottom-tabs`  | Tab navigation               |
| `@react-navigation/native-stack` | Stack navigation             |
| `react-native-safe-area-context` | Safe area handling           |
| `react-native-screens`           | Native screen optimization   |
| `@expo/vector-icons`             | Icon library (Ionicons etc.) |
