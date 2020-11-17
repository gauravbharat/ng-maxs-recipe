import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-odd',
  template: `<p>Odd - {{ number }}</p>`,
  styles: ['p {color: red}'],
})
export class OddComponent implements OnInit {
  @Input() number: number;

  constructor() {}

  ngOnInit(): void {}
}
