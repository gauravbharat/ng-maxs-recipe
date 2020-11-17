import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  /** Set the ingredients of type observable, as returned by the store.select() method */
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  /** Import NgRx Store to get access to application state
   * Set the type of the store to what the shoppingList part/area of the store returns, an Ingrdients array
   */
  constructor(private _store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    /** NgRx and Angular shall unsubscribe from this observable, so no need of manual unsubscribe
     * Alternative is to subscribe to select and set the ingredients array from the response. Unsubscribe is needed in that case.
     */
    this.ingredients = this._store.select('shoppingList');
  }

  onEditItem(index: number) {
    /** Dispatch the edit_start action to the reducer, instead of calling the shopping service Subject.next() */
    this._store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
