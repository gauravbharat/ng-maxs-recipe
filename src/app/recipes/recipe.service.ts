import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private _shoppingService: ShoppingService) {}
  // recipeSelected = new Subject<Recipe>();
  refreshRecipes = new Subject<Recipe[]>();
  private _recipes: Recipe[] = [
    // new Recipe(
    //   'A Test Recipe',
    //   'A quick samosa recipe',
    //   'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT7QCcOwqOwMPbBpgcUhc6KJ8Zjv0YAjJNL7w&usqp=CAU',
    //   [new Ingredient('Flour', 2), new Ingredient('Potato', 5)]
    // ),
    // new Recipe(
    //   'Another Test Recipe',
    //   'A quick lasagna recipe',
    //   'https://hips.hearstapps.com/vidthumb/images/180820-bookazine-delish-01280-1536610916.jpg?crop=1.00xw%3A0.846xh%3B0.00160xw%2C0.154xh&resize=480%3A270',
    //   [new Ingredient('Durum', 3), new Ingredient('Chicken', 2)]
    // ),
  ];

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
    this._shoppingService.addIngredients(ingredients);
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
