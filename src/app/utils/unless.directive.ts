import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  /** Use the setter to create the prop as a method. Use the same name for the property setter as that of the directive selector name */
  @Input() set appUnless(condition: boolean) {
    // Opposite of *ngIf
    if (!condition) {
      this._vcRef.createEmbeddedView(this._templateRef);
    } else {
      this._vcRef.clear();
    }
  }

  /** Like ElementRef gives a reference back to the DOM HTML element, TemplateRef provides reference to the DOM template */
  constructor(
    private _templateRef: TemplateRef<any>,
    private _vcRef: ViewContainerRef
  ) {}
}
