import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private _editedItem: Ingredient;
  private _currentIndexSub$: Subscription;
  editMode = false;
  @ViewChild('form') _form: NgForm;

  constructor(private _store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    /** Instead of using the ShoppingList service and subscribing to the startedEditing Subject for the emitted values, using NgRx,
     * Get the current state from the store, with the selected-item index and data stored in the shoppingList store state */
    this._currentIndexSub$ = this._store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this._editedItem = stateData.editedIngredient;
          this._form.setValue({ ...this._editedItem });
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy() {
    this._currentIndexSub$.unsubscribe();
    /** Dispatch edit-stop from destroy as well, in case if the user navigates away without editing */
    this._store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(): void {
    const ingredient: Ingredient = new Ingredient(
      this._form.value.name,
      this._form.value.amount
    );
    if (this.editMode) {
      this._store.dispatch(
        new ShoppingListActions.UpdateIngredient(ingredient)
      );
    } else {
      /** dispatch() the action to pass the payload to the ngrx reducer/store */
      this._store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.onClearItem();
  }

  onDelete(): void {
    this._store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClearItem();
  }

  onClearItem(): void {
    this.editMode = false;
    this._editedItem = null;
    this._form.reset();
    /** Cancel the start_edit action, initiated from the shopping list component */
    this._store.dispatch(new ShoppingListActions.StopEdit());
  }
}
