import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private _ingredientsAddedSub$: Subscription;

  constructor(private _shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this._getIngredients();

    this._ingredientsAddedSub$ = this._shoppingService.ingredientChanged.subscribe(
      () => {
        // Refresh local list
        this._getIngredients();
      }
    );
  }

  ngOnDestroy() {
    this._ingredientsAddedSub$.unsubscribe();
  }

  onEditItem(index: number) {
    this._shoppingService.startedEditing.next(index);
  }

  private _getIngredients(): void {
    this.ingredients = this._shoppingService.getIngredients();
  }

  // onIngredientItem(ingredient: Ingredient) {
  //   this._shoppingService.addIngredient()
  //   this.ingredients.push(ingredient);
  // }
}
