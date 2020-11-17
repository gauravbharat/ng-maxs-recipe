/** Create a custom attribute directive to toggle 'open' class on a drop-down div */
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropDown]',
})
export class DropDownDirective {
  @HostBinding('class.open') _isOpen = false;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  @HostListener('click') toggleOpen(event: Event) {
    this._isOpen = !this._isOpen;

    // @HostBinding used instead of the renderer code below
    // if (this._isOpen) {
    //   this._renderer.addClass(this._elementRef.nativeElement, 'open');
    // } else {
    //   this._renderer.removeClass(this._elementRef.nativeElement, 'open');
    // }
  }
}
