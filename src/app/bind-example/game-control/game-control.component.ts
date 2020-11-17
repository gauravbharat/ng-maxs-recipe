import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css'],
})
export class GameControlComponent implements OnInit {
  @Output() counter = new EventEmitter<number>();
  private _counterRef: any;
  private _counter = 0;

  constructor() {}

  ngOnInit(): void {}

  onStart(): void {
    this._counterRef = setInterval(() => {
      this.counter.emit(this._counter + 1);
      this._counter++;
    }, 1000);
  }

  onStop(): void {
    clearInterval(this._counterRef);
  }
}
