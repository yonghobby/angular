import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {
  counters: number[] = [];

  addCounter() {
    this.counters.push(0);
  }

  removeCounter(index: number) {
    this.counters.splice(index, 1);
  }

  increment(index: number) {
    this.counters[index]++;
  }

  decrement(index: number) {
    if (this.counters[index] > 0) {
      this.counters[index]--;
    }
  }

  calculateTotal(): number {
    return this.counters.reduce((total, count) => total + count, 0);
  }
}
