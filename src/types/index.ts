
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  categoryId?: string;
  fontSize?: number;
  fontFamily?: string;
  updatedAt: number;
  createdAt: number;
};

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  categoryId?: string;
  createdAt: number;
};

export type FocusFlowData = {
  notes: Note[];
  todos: Todo[];
  categories: Category[];
};
