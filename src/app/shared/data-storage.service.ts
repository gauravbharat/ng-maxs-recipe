import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private _http: HttpClient,
    private _recipeService: RecipeService
  ) {}

  /** Instead of passing an argument of Recipes array to this method,
   * get all the stored recipes from the recipe's service */
  storeRecipes() {
    const recipes = this._recipeService.getRecipes();
    // To replace all backend data, use firebase put() http method instead of post()
    // Store data in recipes.json onto firebase
    this._http
      .put(`https://ng-max-recipe.firebaseio.com/recipes.json`, recipes)
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this._http
      .get<Recipe[]>(`https://ng-max-recipe.firebaseio.com/recipes.json`)
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              // Used the Nullish Coalescing or a null aware operator in Dart
              ingredients: recipe.ingredients ?? [],
            };
          });
        }),
        // Set recipes inside tap, before subscribe
        tap((recipes) => this._recipeService.setRecipes(recipes))
      );

    // /** THIS HAS BEEN HANDLED IN THE INTERCEPTOR NOW */
    // /** The Take(1) rxjs operator informs angular that we wish to take just 1 value and unsubscribe from the subscription.
    //  *
    //  * Returning from subscribe does not work, so how to wait and pass the user token, and return the http observable??
    //  * Solution: We need to pipe the authUser observable and the http observable into one big observable
    //  *
    //  * exhaustMap operator:
    //  * 1. exhaustMap will wait for the authUser observable to complete, after we take the latest user and then unsubscribe from it (authUser)
    //  * 2. pass that user in the exhaustMap, and return the http observable.
    //  * 3. exhauseMap replaces the outer observable (authUser) with the inner observable(http) in the observable chain, and in the end
    //  * the inner observable (http) is returned to the observer
    //  */
    // return this._authService.authUser.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     return this._http.get<Recipe[]>(
    //       `https://ng-max-recipe.firebaseio.com/recipes.json`,
    //       {
    //         params: new HttpParams().set('auth', user.token),
    //       }
    //     );
    //   }),
    //   map((recipes) => {
    //     return recipes.map((recipe) => {
    //       return {
    //         ...recipe,
    //         // Used the Nullish Coalescing or a null aware operator in Dart
    //         ingredients: recipe.ingredients ?? [],
    //       };
    //     });
    //   }),
    //   // Set recipes inside tap, before subscribe
    //   tap((recipes) => this._recipeService.setRecipes(recipes))
    // );
  }
}
