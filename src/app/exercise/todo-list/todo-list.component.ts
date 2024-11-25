import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  todos: { text: string, completed: boolean }[] = [];
  newTodo: string = '';
  error: string = '';
  maxItems: number = 10;

  addTodo() {
    if (!this.newTodo.trim()) {
      this.error = 'Please enter a To-Do item!';
    } else if (this.newTodo.length > 100) {
      this.error = 'To-Do item cannot exceed 100 characters!';
    } else if (this.todos.length >= this.maxItems) {
      this.error = 'You can only add up to 10 To-Do items!';
    } else {
      this.todos.push({ text: this.newTodo, completed: false });
      this.newTodo = '';
      this.error = '';
    }
  }

  toggleComplete(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
  }
}
