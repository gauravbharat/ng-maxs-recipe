import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private _storeShoppingList: Store<fromShoppingList.AppState>) {}
  // recipeSelected = new Subject<Recipe>();
  refreshRecipes = new Subject<Recipe[]>();
  private _recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
    console.log(this._recipes);
    this.refreshRecipes.next([...this._recipes]);
  }

  getRecipe(index: number): Recipe {
    return this._recipes[index];
  }

  getRecipes(): Recipe[] {
    return [...this._recipes];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this._storeShoppingList.dispatch(
      new ShoppingListActions.AddIngredients(ingredients)
    );
  }

  addRecipe(recipe: Recipe) {
    this._recipes.push(recipe);
    this.refreshRecipes.next([...this._recipes]);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this._recipes[index] = newRecipe;
    this.refreshRecipes.next([...this._recipes]);
  }

  deleteRecipe(index: number) {
    this._recipes.splice(index, 1);
    this.refreshRecipes.next([...this._recipes]);
  }

  //TODO: Create an observable from the shopping list to remove the ingredients for the deleted recipe
}
