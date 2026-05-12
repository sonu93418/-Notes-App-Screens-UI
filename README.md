# 📝 Notes App - React Native + Expo

> **A Modern, Responsive Notes Application** built with React Native, Expo, and TypeScript featuring a beautiful dark/light theme system, persistent storage, and a responsive full-width UI.

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.83.6-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-55.0.0-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## ✨ Key Features

- 🎨 **Dark/Light Theme Toggle** - System-aware theme detection with manual override
- 📱 **Fully Responsive UI** - Edge-to-edge full-width layout for phones, tablet-optimized spacing
- 💾 **Persistent Storage** - SecureStore with fallback storage for offline access
- ✍️ **Full CRUD Operations** - Create, read, edit, and delete notes seamlessly
- 🖼️ **Image Support** - Add and display images in note headers
- 🔍 **Smart Search** - Real-time note filtering and search
- ⌨️ **Focus Mode** - Toggle to hide UI controls for distraction-free writing
- 🚀 **TypeScript** - Fully typed codebase with zero compilation errors
- 📅 **Auto-Dating** - Automatic date tracking for each note

---

## 📸 Screenshots & App Views

### Light Mode - Notes List Screen
<div align="center">

```
┌─────────────────────────────────┐
│         Notes   Editor          │  ← Segment Tab Bar
├─────────────────────────────────┤
│    [+ New Note]                 │
├─────────────────────────────────┤
│  Search notes...                │
│  ─────────────────────────────  │
│  Dark Mode    [Toggle]  Focus   │
│              [Toggle]          │
│  ─────────────────────────────  │
│  📝 Expo Definition       12/5  │
│  Expo is a framework...         │
│  [Edit]    [Delete]             │
│  ─────────────────────────────  │
│  📝 React Native Definition      │
│  React Native is open-source...  │
│  [Edit]    [Delete]             │
│                                 │
└─────────────────────────────────┘
```

![Screenshot 1](./assets/images/screenshot-1.jpeg)

### Dark Mode - Note Editor Screen
<div align="center">

```
┌─────────────────────────────────┐
│  10:24  ◷  🔋 80%             │  ← Status Bar
├─────────────────────────────────┤
│    Notes    [Editor]            │  ← Active Tab
├──────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │  [Back]         [Save]      │ │  ← Header Buttons
│ │  ╔═════════════════════════╗ │ │
│ │  ║   [Image Preview]       ║ │ │  ← Note Header Image
│ │  ║                         ║ │ │
│ │  ╚═════════════════════════╝ │ │
│ └─────────────────────────────┘ │
│                                 │
│  Expo Definition                │  ← Title Input
│                                 │
│  Expo is a framework and        │
│  platform built on top of       │  ← Body Input
│  React Native...                │
│                                 │
└─────────────────────────────────┘
```

![Screenshot 2](./assets/images/screenshot-2.jpeg)

</div>

---

## 🏗️ Project Architecture

### Directory Structure

```
Formal-notes/
├── app/
│   ├── _layout.tsx          ← Root layout (Slot-based routing)
│   ├── index.tsx            ← Main screen switcher
│   ├── theme.ts             ← Centralized theme system
│   ├── hooks/
│   │   └── useNotes.ts      ← CRUD + Persistence hook
│   └── screens/
│       ├── NotesListScreen.tsx    ← Notes list view
│       └── NoteEditor.tsx         ← Note editor view
├── assets/
│   └── images/
│       ├── screenshot-1.jpeg      ← Light mode screenshot
│       ├── screenshot-2.jpeg      ← Dark mode screenshot
│       └── ChatGPT Image...png    ← Editor header image
├── package.json
├── tsconfig.json
├── expo-env.d.ts
├── app.json                 ← Expo configuration
└── eslint.config.js
```

---

## 🎯 Core Concepts & Architecture

### 1️⃣ **Theme System** 🎨

#### Centralized Color Palette (`app/theme.ts`)

The app uses a centralized theme system with full light/dark mode support:

```typescript
// Light Mode Colors
{
  background: "#ffffff",
  surface: "#ffffff",
  text: "#0f172a",
  accent: "#eef2ff",
  muted: "#6b7280",
  cardFocus: "#eef2ff",
  placeholder: "#666666",
  headerButtonBg: "rgba(255,255,255,0.9)",
  headerButtonText: "#111827"
}

// Dark Mode Colors
{
  background: "#0b0b0f",
  surface: "#0f1113",
  text: "#f8fafc",
  accent: "#1f2937",
  muted: "#9ca3af",
  cardFocus: "#111827",
  placeholder: "#999999",
  headerButtonBg: "rgba(0,0,0,0.6)",
  headerButtonText: "#f8fafc"
}
```

#### How It Works:
```typescript
import { useColorScheme } from "react-native";
import { getPalette } from "@/app/theme";

const activeScheme = useColorScheme() || "light";
const palette = getPalette(activeScheme);

// Use palette colors throughout the app
backgroundColor: palette.background,
color: palette.text,
```

**Theme Override Options:**
- `"system"` - Follows device settings (default)
- `"light"` - Force light mode
- `"dark"` - Force dark mode

---

### 2️⃣ **Custom Hooks** 🪝

#### `useNotes()` - Complete CRUD & Persistence

The heart of the application! Manages all note operations with persistent storage:

```typescript
const {
  notes,           // Array<Note> - All notes
  loading,         // boolean - Loading state
  saveNote,        // (note: Note) => Promise<string | null>
  deleteNote,      // (id: string) => Promise<void>
  getNoteById,     // (id: string) => Note | undefined
} = useNotes();
```

**Note Type Definition:**
```typescript
type Note = {
  id: string;              // Unique identifier (UUID)
  title: string;           // Note title
  body: string;            // Note content
  date: string;            // Creation/edit date (ISO string)
  image?: string | null;   // Optional image URI
};
```

**Key Features:**
- ✅ Automatic state synchronization with storage
- ✅ Functional updates to prevent race conditions
- ✅ Fallback storage for edge cases
- ✅ Works offline with SecureStore

---

### 3️⃣ **Responsive Layout System** 📱

#### Breakpoint Strategy

The app uses `useWindowDimensions()` for responsive design:

```typescript
const { width } = useWindowDimensions();

// Tablet threshold
const isTablet = width > 700;

// Responsive padding
const horizontalPadding = isTablet ? 48 : 0;  // 0px on phones, 48px on tablets

// Responsive spacing
const headerHeight = Math.max(190, Math.min(280, Math.round(width * 0.24)));
```

**Device Classes:**
- 📱 **Mobile** (`width ≤ 700px`) - Full-width (0px horizontal padding)
- 📊 **Tablet** (`width > 700px`) - Gutter layout (48px horizontal padding)

---

### 4️⃣ **Persistent Storage Layer** 💾

#### Triple-Fallback Storage Strategy

```
Priority 1: expo-secure-store (Encrypted, native)
    ↓ [If unavailable]
Priority 2: localStorage (Web browsers)
    ↓ [If unavailable]
Priority 3: In-Memory Store (Fallback)
```

**Storage Operations:**

```typescript
// Automatic save on every note change
await storageSet(STORAGE_KEY, JSON.stringify(updatedNotes));

// Automatic load on app launch
useEffect(() => {
  loadNotes();  // Called once on component mount
}, []);
```

**Error Handling:**
- All storage errors logged with `console.warn` (non-blocking)
- App continues functioning even if storage fails
- Graceful degradation to in-memory storage

---

### 5️⃣ **Complete CRUD Operations** ✍️

#### Create a Note

```typescript
const handleCreateNote = () => {
  const newNote: Note = {
    id: "uuid-" + Date.now(),
    title: "New Note",
    body: "",
    date: new Date().toLocaleDateString(),
    image: null,
  };
  
  saveNote(newNote);  // Auto-saves to storage
};
```

#### Read Notes

```typescript
// Get all notes
const allNotes = notes;

// Search/filter notes
const filtered = notes.filter(n =>
  n.title.toLowerCase().includes(query) ||
  n.body.toLowerCase().includes(query)
);

// Get single note by ID
const note = getNoteById(noteId);
```

#### Update a Note

```typescript
const handleSaveNote = (title: string, body: string, image?: string) => {
  const updatedNote: Note = {
    ...editingNote,  // Preserve ID and original date
    title,
    body,
    date: new Date().toLocaleDateString(),
    image,
  };
  
  saveNote(updatedNote);  // Updates existing or creates new
};
```

#### Delete a Note

```typescript
const handleDeleteNote = (noteId: string) => {
  deleteNote(noteId);  // Removes from storage
};
```

---

## 🚀 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.83.6 | Mobile app framework |
| Expo | 55.0.0 | Development & deployment platform |
| TypeScript | 5.9.2 | Type-safe JavaScript |
| expo-router | Latest | File-based routing (Slot) |
| expo-secure-store | 55.0.13 | Encrypted secure storage |
| React | 18.x | Core React framework |

---

## 📚 Component Guide

### `app/_layout.tsx` - Root Layout
- **Role**: Application root with Slot-based routing
- **Features**: Responsive horizontal padding (0px mobile, 48px tablet)
- **Styling**: Solid background color from theme

### `app/index.tsx` - Main Screen Switcher
- **Role**: Orchestrates navigation between Notes List and Editor
- **State Management**: 
  - Current screen (list/editor)
  - Theme override (system/light/dark)
  - Editing note ID
- **Handler Functions**:
  - `handleNewNote()` - Create new note
  - `handleEditNote(id)` - Switch to editor mode
  - `handleSaveNote(title, body, image)` - Persist note
  - `handleDeleteNote(id)` - Remove note

### `app/screens/NotesListScreen.tsx` - Notes List
- **Features**:
  - Real-time search filtering
  - Dark Mode toggle (global)
  - Focus Mode toggle (hides controls)
  - Edit/Delete buttons per note
  - Full-width responsive container
- **Performance**: FlatList for efficient rendering of large note lists

### `app/screens/NoteEditor.tsx` - Note Editor
- **Features**:
  - Header image with responsive height calculation
  - Title & body TextInput fields
  - Back & Save buttons with dark overlay
  - KeyboardAvoidingView for safe keyboard spacing
  - SafeAreaView for notch/status bar safety
- **Styling**: Full-width layout with cover-mode image

### `app/theme.ts` - Theme System
- **Exports**:
  - `Palette` type definition
  - `ThemeOverride` type (system | light | dark)
  - `palettes` object (light & dark color sets)
  - `getPalette(scheme)` function

### `app/hooks/useNotes.ts` - Data Management
- **Features**:
  - CRUD operations (Create, Read, Update, Delete)
  - Persistent storage with fallbacks
  - Loading state management
  - Type-safe Note operations

---

## 🛠️ Getting Started

### Prerequisites

```bash
- Node.js 16+ (Recommended: Node 18 LTS)
- npm or yarn
- Expo CLI: npm install -g expo-cli
```

### Installation

```bash
# Clone the repository
git clone https://github.com/sonu93418/-Notes-App-Screens-UI.git
cd Formal-notes

# Install dependencies
npm install

# Install Expo CLI (if not already installed)
npm install -g expo-cli
```

### Run on Expo Go (Easiest)

```bash
# Start Expo development server
npx expo start

# Press 'i' for iOS simulator or 'a' for Android emulator
# Or scan QR code with Expo Go mobile app
```

### Build for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

---

## 💡 Key Implementation Details

### State Management Flow

```
Root (app/index.tsx)
  ├── themeOverride → All children
  ├── activeScheme (from useColorScheme + override)
  ├── editingNoteId → Editor screen
  └── Handler functions (onCreate, onEdit, onSave, onDelete)
        ↓
   useNotes() Hook
        ↓
   SecureStore/localStorage
```

### Full-Width Responsive Implementation

```typescript
// All containers use explicit full-width styling:
<View style={{ width: "100%" }}>
  {/* Content stretches edge-to-edge on phones */}
  {/* Tablets maintain 48px horizontal padding at root level */}
</View>

// Root padding strategy:
const horizontal = width > 700 ? 48 : 0;  // Phones: 0, Tablets: 48px
```

### Theme Toggle Flow

```
User toggles theme
  ↓
themeOverride state updates in app/index.tsx
  ↓
activeScheme recalculates (system or override)
  ↓
getPalette(activeScheme) called in all screens
  ↓
All UI colors update instantly (no page reload)
  ↓
State syncs to storage (SecureStore)
```

---

## 📖 Usage Examples

### Creating a New Note

```typescript
// In app/index.tsx
const handleNewNote = () => {
  setEditingNoteId(null);  // Clear edit mode
  setScreen("editor");      // Switch to editor
};

// In NoteEditor.tsx
const handleSave = (title: string, body: string) => {
  const newNote: Note = {
    id: generateUUID(),
    title,
    body,
    date: new Date().toLocaleDateString(),
    image: selectedImage,
  };
  onSave(title, body, selectedImage);
  // Parent calls saveNote(newNote) → stored in SecureStore
};
```

### Searching Notes

```typescript
const [searchQuery, setSearchQuery] = useState("");

const filteredNotes = notes.filter(note =>
  note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  note.body.toLowerCase().includes(searchQuery.toLowerCase())
);

// Render filteredNotes in FlatList
<FlatList data={filteredNotes} ... />
```

### Switching Themes

```typescript
const [themeOverride, setThemeOverride] = useState<ThemeOverride>("system");

const handleThemeToggle = () => {
  setThemeOverride(prev => 
    prev === "dark" ? "light" : "dark"
  );
};

// Theme automatically updates across all screens
```

---

## 🎨 Color Palette Reference

### Light Mode
| Element | Color |
|---------|-------|
| Background | `#ffffff` |
| Text | `#0f172a` |
| Accent | `#eef2ff` |
| Muted | `#6b7280` |

### Dark Mode
| Element | Color |
|---------|-------|
| Background | `#0b0b0f` |
| Text | `#f8fafc` |
| Accent | `#1f2937` |
| Muted | `#9ca3af` |

---

## ✅ Checklist - What's Implemented

- ✅ Two-screen UI (Notes List + Editor)
- ✅ Global dark/light theme toggle with system detection
- ✅ Centralized theme system with color palettes
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Persistent storage using SecureStore + fallbacks
- ✅ Auto-dating for notes
- ✅ Image support in note headers
- ✅ Real-time search filtering
- ✅ Focus mode toggle
- ✅ Full-width responsive layout (0px mobile, 48px tablet)
- ✅ Status bar/notch safe areas (SafeAreaView)
- ✅ TypeScript with zero compilation errors
- ✅ Optimized performance with FlatList
- ✅ Keyboard-aware layout (KeyboardAvoidingView)

---

## 🐛 Troubleshooting

### Notes not saving?
- Check if SecureStore is available
- Verify fallback storage is working
- Check browser console for storage errors

### Theme not switching?
- Verify `useColorScheme()` is returning correct value
- Check `getPalette()` function in theme.ts
- Clear Expo cache: `npx expo start -c`

### Layout not full-width?
- Verify root `_layout.tsx` has correct padding: `const horizontal = width > 700 ? 48 : 0;`
- Check all containers have `width: "100%"`
- Ensure no unexpected margins on parent Views

### Metro bundler errors?
- Clear cache: `npx expo start --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Restart Expo server

---

## 📝 Notes

- The app uses **functional state updates** in `saveNote()` and `deleteNote()` to prevent race conditions
- All storage operations are **non-blocking** - errors don't crash the app
- The theme system uses **system detection first** with **manual override** capability
- Images are stored as **URI strings** (can be local file paths or base64 data)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Sonu Verma**
- GitHub: [@sonu93418](https://github.com/sonu93418)
- Repository: [-Notes-App-Screens-UI](https://github.com/sonu93418/-Notes-App-Screens-UI)

---

<div align="center">

### ⭐ If you find this project helpful, please consider giving it a star!

**Built with ❤️ using React Native & Expo**

</div>
