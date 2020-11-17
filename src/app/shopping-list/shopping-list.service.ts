/** Replaced with NgRx */

// import { Subject } from 'rxjs';
// import { Ingredient } from '../shared/ingredient.model';

// export class ShoppingService {
//   ingredientChanged = new Subject<void>();
//   startedEditing = new Subject<number>();
//   private _ingredients: Ingredient[] = [
//     new Ingredient('Apples', 5),
//     new Ingredient('Tomatoes', 10),
//   ];

//   getIngredients(): Ingredient[] {
//     // Send a copy of the array, to avoid any change to original
//     return [...this._ingredients];
//   }

//   getIngredient(index: number): Ingredient {
//     return this._ingredients[index];
//   }

//   addIngredient(ingredient: Ingredient): void {
//     this._ingredients.push(ingredient);
//     this.ingredientChanged.next();
//   }

//   updateIngredient(index: number, newIngredient: Ingredient): void {
//     this._ingredients[index] = newIngredient;
//     this.ingredientChanged.next();
//   }

//   addIngredients(ingredients: Ingredient[]): void {
//     /** Instead of looping and calling the addIngredient(() method each time AND unnecessarily emitting multiple events,
//      * add the ingredients directly and then emit an event
//      */
//     // ingredients.forEach((ingredient) => this.addIngredient(ingredient));
//     // this._ingredients = [...this._ingredients, ...ingredients];
//     this._ingredients.push(...ingredients);
//     this.ingredientChanged.next();
//   }

//   removeIngredient(index: number) {
//     this._ingredients.splice(index, 1);
//     this.ingredientChanged.next();
//   }
// }
