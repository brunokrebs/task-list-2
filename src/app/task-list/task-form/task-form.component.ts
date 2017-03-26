import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {

  @Output()
  taskAdded = new EventEmitter();

  public task: String = null;

  addTask() {
    this.taskAdded.emit(this.task);
    this.task = null;
  }
}