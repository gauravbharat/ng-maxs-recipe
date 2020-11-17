import { Directive, ElementRef, OnInit } from '@angular/core';

/** Using the [] sq brackets informs angular to use/treat this selector as an attribute instead of an element or a tag */
@Directive({
  selector: '[appBasicHighlight]',
})
export class BasicHighlightDirective implements OnInit {
  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    this._elementRef.nativeElement.style.backgroundColor = 'coral';
  }
}
