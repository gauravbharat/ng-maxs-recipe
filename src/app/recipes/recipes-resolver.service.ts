import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

/** Use route resolver before any route is executed
 * Resolve is a generic interface, means need to define the type of data expected to be received
 */
@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private _dataStorageService: DataStorageService,
    private _recipeService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this._recipeService.getRecipes();

    if (recipes.length === 0) {
      // Not subscribing here, because the resolve() method would subsribe once the data is there
      return this._dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
