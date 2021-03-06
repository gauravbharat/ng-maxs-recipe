import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from 'src/environments/environment';
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

/** NgRx reducers */
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  /** Do NOT import lazily loaded feature modules here, only eagerly loading modules here */
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,

    /** import StoreModule and pass the reducers with identifiers
     * forRoot(object) tells the app which reducers are available in the application to make up the NgRx store
     * forRoot({feature: reducer})
     * NgRx will call the Reducer with the action it received and with the current state
     */
    StoreModule.forRoot(fromApp.appReducer),

    /** Register Effects Module. Pass an array of root Effect classes */
    EffectsModule.forRoot([AuthEffects]),

    /** Register NgRx devtools to be used with the Redux Devtools chrome extension.
     * Restricting Devtools output to only some logs in production
     */
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),

    /** Register NgRx router-store. React to angular routing actions by angular router.
     * Then, write a code in ngrx effects or reducer when the routing actions happens */
    StoreRouterConnectingModule.forRoot(),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
