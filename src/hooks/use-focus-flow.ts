
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { FocusFlowData, Note, Todo, Category } from '@/types';

const STORAGE_KEY = 'focus_flow_data';

const INITIAL_DATA: FocusFlowData = {
  notes: [
    {
      id: 'welcome-note',
      title: 'Welcome to FocusFlow!',
      content: '<div>Start taking <b>bold</b> notes, create <i>italics</i>, or <u>underline</u> important points. FocusFlow autosaves everything locally in your browser.</div>',
      fontSize: 20,
      fontFamily: 'var(--font-body)',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ],
  todos: [
    {
      id: 'first-todo',
      text: 'Explore FocusFlow features',
      completed: false,
      createdAt: Date.now(),
    }
  ],
  categories: [
    { id: 'cat-personal', name: 'Personal', color: '#64B5F6' },
    { id: 'cat-work', name: 'Work', color: '#81C784' },
  ]
};

export function useFocusFlow() {
  const [data, setData] = useState<FocusFlowData>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse FocusFlow data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Autosave when data changes (debounced)
  useEffect(() => {
    if (!isLoaded) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 1000); // 1s debounce for autosave

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [data, isLoaded]);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      fontSize: 20,
      fontFamily: 'var(--font-body)',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setData(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(note => 
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id)
    }));
  }, []);

  const addTodo = useCallback((text: string, categoryId?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      categoryId,
      createdAt: Date.now(),
    };
    setData(prev => ({ ...prev, todos: [newTodo, ...prev.todos] }));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== id)
    }));
  }, []);

  const reorderTodos = useCallback((newTodos: Todo[]) => {
    setData(prev => ({ ...prev, todos: newTodos }));
  }, []);

  const addCategory = useCallback((name: string, color: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  }, []);

  return {
    data,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    addCategory,
  };
}
