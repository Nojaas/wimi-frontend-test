export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  todoListId: string;
}

export interface TodoList {
  id: string;
  name: string;
  userId: string;
}
