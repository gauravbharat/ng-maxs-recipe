import {
  Directive,
  Renderer2,
  ElementRef,
  OnInit,
  HostListener,
  HostBinding,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective implements OnInit {
  /** Renderer2
   * Defn: Extend this base class to implement custom rendering. By default, Angular renders a template into DOM.
   * You can use custom rendering to intercept rendering calls, or to render to something other than DOM.
   *
   * Use _renderer to access DOM HTML element via the Renderer2 class object instead of directly accessing the DOM.
   *
   * The Renderer2 class is an abstraction provided by Angular in the form of a service that allows to manipulate elements of your app without
   * having to touch the DOM directly. This is the recommended approach because it then makes it easier to develop apps that can be rendered
   * in environments that don’t have DOM access, like on the server, in a web worker or on native mobile.
   * */
  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  /** Custom property binding using @Input, instead of hard-coded prop values
   * The custom property name should NOT match any existing native property name of the DOM element
   */
  @Input() defaultColor: string = 'transparent';
  @Input() highlightColor: string = 'blue';

  /** HostBinding: Bind to specific DOM element property, to control it from here
   * An alternative to Renderer2, but the latter is a recommended approach
   *
   * Don't MIX any conditional code using HostBinding with Renderer2, as it may have unknown effects
   */
  @HostBinding('style.backgroundColor') backgroundColor: string;

  ngOnInit(): void {
    this.backgroundColor = this.defaultColor;

    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'cursor',
      'pointer'
    );
  }

  /** HostListener: Listen to DOM elementRef events to change the css style of the DOM element */
  @HostListener('mouseover') mouseover(event: Event) {
    // this._renderer.setStyle(
    //   this._elementRef.nativeElement,
    //   'background-color',
    //   'blue'
    // );
    this.backgroundColor = this.highlightColor;
    this._renderer.setStyle(this._elementRef.nativeElement, 'color', 'white');
  }

  @HostListener('mouseleave') mouseleave(event: Event) {
    // this._renderer.setStyle(
    //   this._elementRef.nativeElement,
    //   'background-color',
    //   'transparent'
    // );
    this.backgroundColor = this.defaultColor;
    this._renderer.setStyle(this._elementRef.nativeElement, 'color', 'black');
  }
}
