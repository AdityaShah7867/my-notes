
"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { Note, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Trash2, 
  Calendar, 
  CheckSquare, 
  List,
  ListOrdered,
  Tag,
  ChevronDown,
  Undo,
  Redo,
  Download,
  AArrowUp,
  AArrowDown,
  Type
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const FONT_FAMILIES = [
  { name: 'Default', value: 'var(--font-body)' },
  { name: 'Serif', value: 'serif' },
  { name: 'Sans-Serif', value: 'sans-serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
];

export function NoteEditor({ note, categories, onUpdate, onDelete }: NoteEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [fontSize, setFontSize] = useState(note.fontSize || 20);
  const [fontFamily, setFontFamily] = useState(note.fontFamily || 'var(--font-body)');

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== note.content && !isInternalChange.current) {
      contentRef.current.innerHTML = note.content;
    }
    isInternalChange.current = false;
    setFontSize(note.fontSize || 20);
    setFontFamily(note.fontFamily || 'var(--font-body)');
  }, [note.id]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      isInternalChange.current = true;
      const newContent = contentRef.current.innerHTML;
      
      const text = contentRef.current.innerText || '';
      if (text.endsWith('/todo')) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const textNode = range.startContainer;
          if (textNode.nodeType === Node.TEXT_NODE) {
            const textContent = textNode.textContent || '';
            const todoIndex = textContent.lastIndexOf('/todo');
            textNode.textContent = textContent.substring(0, todoIndex);
            
            range.setStart(textNode, todoIndex);
            range.setEnd(textNode, todoIndex);
            selection.removeAllRanges();
            selection.addRange(range);
            
            insertTodo();
            return;
          }
        }
      }

      onUpdate(note.id, { content: newContent });
    }
  }, [note.id, onUpdate]);

  const insertTodo = () => {
    const checkboxHtml = `<div><input type="checkbox" onclick="this.setAttribute('checked', this.checked ? 'checked' : '')"> </div>`;
    document.execCommand('insertHTML', false, checkboxHtml);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          execCommand('redo');
        } else {
          execCommand('undo');
        }
      } else if (e.key === 'y') {
        e.preventDefault();
        execCommand('redo');
      }
    }

    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let container = range.startContainer;
        
        let lineElement = container.nodeType === Node.ELEMENT_NODE 
          ? (container as HTMLElement) 
          : container.parentElement;

        while (lineElement && lineElement !== contentRef.current && !['DIV', 'P', 'LI'].includes(lineElement.tagName)) {
          lineElement = lineElement.parentElement;
        }

        if (lineElement && lineElement.querySelector('input[type="checkbox"]')) {
          const text = lineElement.textContent?.trim() || '';
          
          if (text === '') {
            e.preventDefault();
            lineElement.innerHTML = '<br>';
            const newRange = document.createRange();
            newRange.setStart(lineElement, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } else {
            e.preventDefault();
            const nextTodo = document.createElement('div');
            nextTodo.innerHTML = `<input type="checkbox" onclick="this.setAttribute('checked', this.checked ? 'checked' : '')"> &nbsp;`;
            lineElement.after(nextTodo);
            
            const newRange = document.createRange();
            newRange.setStart(nextTodo, 1);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
          handleInput();
          return;
        }

        if (lineElement && lineElement.tagName === 'LI') {
          const text = lineElement.textContent?.trim() || '';
          if (text === '') {
            e.preventDefault();
            document.execCommand('outdent', false);
            handleInput();
          }
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const imgHtml = `<img src="${base64}" />`;
            document.execCommand('insertHTML', false, imgHtml);
            handleInput();
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const downloadAsTxt = () => {
    if (!contentRef.current) return;
    const text = contentRef.current.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title || 'Untitled Note'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.max(8, Math.min(100, newSize));
    setFontSize(size);
    onUpdate(note.id, { fontSize: size });
  };

  const handleFontFamilyChange = (newFont: string) => {
    setFontFamily(newFont);
    onUpdate(note.id, { fontFamily: newFont });
  };

  const currentCategory = categories.find(c => c.id === note.categoryId);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden transition-all duration-300">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2 border-b bg-muted/20 gap-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('undo')} title="Undo (Ctrl+Z)">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('redo')} title="Redo (Ctrl+Y)">
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-[1px] h-4 bg-border mx-1 shrink-0" />
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('bold')} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('italic')} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('underline')} title="Underline">
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-[1px] h-4 bg-border mx-1 shrink-0" />
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-primary" onClick={insertTodo} title="To-Do Item (or type /todo)">
            <CheckSquare className="h-4 w-4" />
          </Button>
          <div className="w-[1px] h-4 bg-border mx-1 shrink-0" />
          
          <div className="flex items-center gap-1 px-1 bg-background/50 rounded-md border border-border/50">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFontSizeChange(fontSize - 2)} title="Decrease Font Size">
              <AArrowDown className="h-3 w-3" />
            </Button>
            <Input 
              type="number" 
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || fontSize)}
              className="h-6 w-12 text-center p-0 border-none bg-transparent text-xs font-mono"
            />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFontSizeChange(fontSize + 2)} title="Increase Font Size">
              <AArrowUp className="h-3 w-3" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-xs border border-border/50 bg-background/50">
                <Type className="h-3 w-3" />
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {FONT_FAMILIES.find(f => f.value === fontFamily)?.name || 'Font'}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {FONT_FAMILIES.map(font => (
                <DropdownMenuItem 
                  key={font.value} 
                  onClick={() => handleFontFamilyChange(font.value)}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={downloadAsTxt} title="Download as .txt">
            <Download className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 text-xs font-medium border border-border/50 bg-background/50">
                <Tag className="h-3 w-3" style={{ color: currentCategory?.color }} />
                <span className="max-w-[80px] truncate">{currentCategory?.name || 'Category'}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider opacity-50">Assign to Collection</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onUpdate(note.id, { categoryId: undefined })} className="cursor-pointer">
                None
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map(cat => (
                <DropdownMenuItem 
                  key={cat.id} 
                  onClick={() => onUpdate(note.id, { categoryId: cat.id })}
                  className="gap-2 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors" onClick={() => onDelete(note.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-8 md:p-12 lg:p-16 flex flex-col gap-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          className="text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/20 selection:bg-primary/20 text-foreground"
          placeholder="Untitled Note"
        />
        
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }}
          className="note-editor-content flex-1 leading-relaxed text-foreground min-h-[400px] focus:outline-none selection:bg-primary/20"
          data-placeholder="Start typing your thoughts, use /todo for tasks, or paste images..."
        />
      </div>

      <div className="px-8 py-3 border-t border-border/50 bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>Updated {format(note.updatedAt, 'MMM d, h:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Cloud Sync Active
        </div>
      </div>
    </div>
  );
}
