# FocusFlow

A modern, minimalist note-taking and task management application built with Next.js. FocusFlow helps you capture thoughts, organize ideas, and manage tasks with a clean, distraction-free interface designed to promote focus and productivity.

## ✨ Features

### Note Taking
- **Rich Text Editing**: Format text with bold, italic, underline, and more
- **Lists & Organization**: Create bulleted and numbered lists
- **Todo Integration**: Insert todo items directly in notes using `/todo` command
- **Image Support**: Paste images directly into notes
- **Customizable Typography**: Adjust font size (8-100px) and choose from multiple font families
- **Download Notes**: Export notes as `.txt` files
- **Undo/Redo**: Full undo/redo support with keyboard shortcuts

### Task Management
- **Todo Lists**: Create and manage tasks with completion status
- **Drag & Drop**: Reorder tasks with intuitive drag-and-drop functionality
- **Task Completion**: Mark tasks as complete with visual feedback
- **Quick Add**: Fast task creation with keyboard shortcuts

### Organization
- **Categories/Collections**: Organize notes and tasks into custom collections
- **Color-Coded Categories**: Visual organization with color-coded categories
- **Search Functionality**: Quickly find notes by title or content
- **Filter by Category**: View notes filtered by specific collections

### User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Auto-save**: Automatic local storage sync (1-second debounce)
- **Smooth Animations**: Polished transitions using Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation
- **Focus Mode**: Clean, minimalist interface designed for distraction-free work

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.1
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion 11.0.8
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Storage**: Browser LocalStorage
- **AI Integration**: Google Genkit (Firebase AI)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd download
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (if using Firebase/Genkit features)
   ```bash
   cp .env.example .env.local
   # Add your Firebase configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with watch mode

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main FocusFlow page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AppSidebar.tsx    # Sidebar navigation with notes/categories
│   ├── NoteEditor.tsx    # Rich text note editor
│   ├── TodoList.tsx      # Todo list component
│   └── ui/               # Reusable UI components (shadcn/ui)
├── hooks/                # Custom React hooks
│   ├── use-focus-flow.ts # Main data management hook
│   ├── use-mobile.tsx    # Mobile detection hook
│   └── use-toast.ts      # Toast notification hook
├── lib/                  # Utility functions
│   ├── utils.ts          # Common utilities (cn, etc.)
│   └── placeholder-images.ts
├── types/                # TypeScript type definitions
│   └── index.ts          # Core data types
└── ai/                   # AI/Genkit integration
    ├── dev.ts            # Genkit development setup
    └── genkit.ts         # Genkit configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Calm Blue (#64B5F6) - Promotes focus and calm
- **Background**: Light Gray (#F0F4F8) - Comfortable readability
- **Accent**: Soft Green (#81C784) - Task completion and highlights
- **Font**: PT Sans (sans-serif) - Modern and warm typography

### UI Principles
- Minimalist and clean interface
- Intuitive navigation with sidebar
- Subtle transitions and animations
- Responsive design for all screen sizes
- Dark mode support

## 💡 Usage Guide

### Creating Notes
1. Click the "+" button in the sidebar or use the "Create your first note" button
2. Enter a title in the header
3. Start typing in the content area
4. Use the toolbar to format text (bold, italic, underline)
5. Notes auto-save every second

### Adding Todos
- **In Notes**: Type `/todo` and press Enter to insert a checkbox
- **In Todo List**: Use the "Add Task" input at the top
- Press Enter on a todo item to create another one below

### Organizing with Categories
1. Click the category dropdown in the note editor toolbar
2. Select an existing category or create a new one
3. Filter notes by category using the sidebar
4. Categories are color-coded for visual organization

### Keyboard Shortcuts
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z` - Redo
- `Enter` on todo item - Create new todo below
- Type `/todo` in note - Insert todo checkbox

### Searching Notes
- Use the search bar in the sidebar
- Search matches both note titles and content
- Results update in real-time

## 🔧 Configuration

### Local Storage
All data is stored in browser localStorage under the key `focus_flow_data`. The data structure includes:
- Notes array
- Todos array
- Categories array

### Autosave
Notes are automatically saved to localStorage with a 1-second debounce to prevent excessive writes while typing.

### Theme
Theme preference is stored in localStorage and persists across sessions. The app respects system dark mode preference on first load.

## 🏗️ Architecture

### Data Flow
1. **State Management**: Custom `useFocusFlow` hook manages all application state
2. **Local Storage**: Data persists automatically via useEffect hooks
3. **Component Communication**: Props-based data flow with callback functions
4. **Real-time Updates**: React state updates trigger UI re-renders

### Key Components

**AppSidebar**
- Displays list of notes and categories
- Handles note selection and filtering
- Search functionality
- Theme toggle

**NoteEditor**
- Rich text editing with contentEditable
- Formatting toolbar
- Font customization
- Category assignment
- Download functionality

**TodoList**
- Drag-and-drop reordering
- Task completion tracking
- Add/delete tasks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**FocusFlow** - Capture your thoughts, organize your ideas, focus on what matters.
