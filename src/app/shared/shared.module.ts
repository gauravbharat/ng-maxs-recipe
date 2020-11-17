import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/** Custome Pipes (for templates) */
import { ShortenPipe } from '../recipes/shorten.pipe';

/** Custom Directives */
import { DropDownDirective } from './dropdown.directive';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';

/** Custom Components */
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
    DropDownDirective,
    ShortenPipe,
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
    DropDownDirective,
    ShortenPipe,
    CommonModule,
  ],
  /** entryComponents prop: Dynamic components needs to be informed to Angular here */
  entryComponents: [AlertComponent],
})
export class SharedModule {}
