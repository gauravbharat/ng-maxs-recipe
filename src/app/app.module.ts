import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// /** Custom TEST Directives */
// import { BasicHighlightDirective } from './utils/basic-highlight.directive'; //Attribute
// import { BetterHighlightDirective } from './utils/better-hightlight.directive'; //Attribute
// import { UnlessDirective } from './utils/unless.directive'; //Structural
import { DropDownDirective } from './shared/dropdown.directive';
import { PlaceHolderDirective } from './shared/placeholder/placeholder.directive';

/** Custom Services */
import { RecipeService } from './recipes/recipe.service';
import { ShoppingService } from './shopping-list/shopping-list.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

/** Customer Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/alert/alert.component';

/** Custom Modules */
import { RecipesModule } from './recipes/recipes.module';

@NgModule({
  declarations: [
    AppComponent,
    DropDownDirective,
    // BasicHighlightDirective,
    // BetterHighlightDirective,
    // UnlessDirective,
    HeaderComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    PlaceHolderDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    RecipesModule,
  ],
  providers: [
    RecipeService,
    ShoppingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  /** entryComponents prop: Dynamic components needs to be informed to Angular here */
  entryComponents: [AlertComponent],
})
export class AppModule {}
