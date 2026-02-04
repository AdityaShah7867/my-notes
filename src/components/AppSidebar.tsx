"use client";

import { Note, Category } from '@/types';
import { 
  FileText, 
  Search, 
  Plus, 
  Hash, 
  Folder,
  LayoutGrid,
  Settings,
  MoreHorizontal,
  Sun,
  Moon,
  Trash2,
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppSidebarProps {
  notes: Note[];
  categories: Category[];
  activeNoteId: string | null;
  activeCategoryId: string | null;
  onNoteSelect: (id: string) => void;
  onCategorySelect: (id: string | null) => void;
  onAddNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function AppSidebar({
  notes,
  categories,
  activeNoteId,
  activeCategoryId,
  onNoteSelect,
  onCategorySelect,
  onAddNote,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleTheme
}: AppSidebarProps) {
  const { state } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" className="border-r bg-card shadow-sm">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div 
            className={cn(
              "flex items-center gap-2 overflow-hidden transition-all duration-300 cursor-pointer", 
              state === 'collapsed' ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
            onClick={() => onCategorySelect(null)}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">FocusFlow</h1>
          </div>
          <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
        </div>
        
        {state !== 'collapsed' && (
          <div className="mt-4 relative animate-in fade-in slide-in-from-top-1 duration-300">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notes..." 
              className="pl-9 bg-muted/30 border-none h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2">
            <span>Main</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeCategoryId === null}
                  onClick={() => onCategorySelect(null)}
                  tooltip="All Notes"
                >
                  <Inbox className="h-4 w-4" />
                  <span>All Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2">
            <span>Collections</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat.id}>
                  <SidebarMenuButton
                    isActive={activeCategoryId === cat.id}
                    onClick={() => onCategorySelect(cat.id)}
                    tooltip={cat.name}
                  >
                    <Folder className="h-4 w-4" style={{ color: cat.color }} />
                    <span>{cat.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2">
            <span>Notes</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" onClick={onAddNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes.map(note => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton
                    isActive={activeNoteId === note.id}
                    onClick={() => onNoteSelect(note.id)}
                    tooltip={note.title || 'Untitled Note'}
                  >
                    <FileText className="h-4 w-4 opacity-70" />
                    <span className="truncate">{note.title || 'Untitled Note'}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {notes.length === 0 && state !== 'collapsed' && (
                <p className="px-4 py-4 text-xs text-muted-foreground/60 italic text-center">
                  No notes found
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                  <MoreHorizontal className="ml-auto h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56 p-2">
                <DropdownMenuItem onClick={onToggleTheme} className="flex items-center justify-between cursor-pointer">
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                  Clear All Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}