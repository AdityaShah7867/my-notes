
"use client";

import { useState } from 'react';
import { Todo, Category } from '@/types';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (text: string) => void;
  onReorder: (todos: Todo[]) => void;
}

export function TodoList({ todos, onToggle, onDelete, onAdd, onReorder }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground">Task List</h2>
        <p className="text-muted-foreground">Focus on one task at a time.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1"
        />
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>

      <Reorder.Group axis="y" values={todos} onReorder={onReorder} className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <Reorder.Item
              key={todo.id}
              value={todo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={cn(
                "group flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm transition-all hover:shadow-md",
                todo.completed && "bg-muted/50 border-transparent"
              )}
            >
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4" />
              </div>
              
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggle(todo.id)}
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              
              <span className={cn(
                "flex-1 text-base transition-all",
                todo.completed && "text-muted-foreground line-through decoration-muted-foreground/50"
              )}>
                {todo.text}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {todos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
          <div className="p-4 rounded-full bg-muted/30 mb-4">
            <Plus className="h-8 w-8" />
          </div>
          <p>No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
