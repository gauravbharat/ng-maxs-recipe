import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// /** Custom TEST Directives */
// import { BasicHighlightDirective } from './utils/basic-highlight.directive'; //Attribute
// import { BetterHighlightDirective } from './utils/better-hightlight.directive'; //Attribute
// import { UnlessDirective } from './utils/unless.directive'; //Structural

/** Custom Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

/** Custom Modules */
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  /** Do NOT import lazily loaded feature modules here, only eagerly loading modules here */
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
