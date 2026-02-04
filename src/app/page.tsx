"use client";

import { useState, useMemo, useEffect } from 'react';
import { useFocusFlow } from '@/hooks/use-focus-flow';
import { AppSidebar } from '@/components/AppSidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, PlusCircle } from 'lucide-react';

export default function FocusFlowPage() {
  const {
    data,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
  } = useFocusFlow();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const filteredNotes = useMemo(() => {
    let notes = data.notes;
    
    if (activeCategoryId) {
      notes = notes.filter(n => n.categoryId === activeCategoryId);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      notes = notes.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.content.toLowerCase().includes(query)
      );
    }
    
    return notes;
  }, [data.notes, activeCategoryId, searchQuery]);

  const currentNote = useMemo(() => {
    if (!activeNoteId) return filteredNotes[0] || null;
    return data.notes.find(n => n.id === activeNoteId) || filteredNotes[0] || null;
  }, [activeNoteId, data.notes, filteredNotes]);

  const handleAddNote = () => {
    const id = addNote();
    setActiveNoteId(id);
    // If we're in a category, automatically assign it to the new note
    if (activeCategoryId) {
      updateNote(id, { categoryId: activeCategoryId });
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <AppSidebar
        notes={filteredNotes}
        categories={data.categories}
        activeNoteId={activeNoteId || (filteredNotes[0]?.id || null)}
        activeCategoryId={activeCategoryId}
        onNoteSelect={setActiveNoteId}
        onCategorySelect={setActiveCategoryId}
        onAddNote={handleAddNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNote?.id || 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full p-4 md:p-8 lg:p-12 overflow-hidden"
          >
            {currentNote ? (
              <NoteEditor
                note={currentNote}
                categories={data.categories}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="p-6 rounded-full bg-card shadow-sm border border-dashed border-primary/20">
                  <PlusCircle className="h-12 w-12 text-primary/40" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-foreground">
                    {activeCategoryId ? 'No notes in this collection' : 'Capture your thoughts'}
                  </h3>
                  <p className="text-sm mt-1">Start fresh with a new workspace.</p>
                </div>
                <button
                  onClick={handleAddNote}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Create {activeCategoryId ? 'a note here' : 'your first note'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}