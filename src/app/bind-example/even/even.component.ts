import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-even',
  template: `<ng-content></ng-content>`,
  styles: ['::ng-deep p {color: blue}'],
})
export class EvenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
