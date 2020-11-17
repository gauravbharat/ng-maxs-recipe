import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AuthInterceptorService } from './auth/auth-interceptor.service';

/** Custom Feature services (better approach, use {providedIn: 'root'} for these) */
import { RecipeService } from './recipes/recipe.service';

@NgModule({
  /** Services are not required to be exported (like components), since they are automatically injected in the root module */
  providers: [
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {}
