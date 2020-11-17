/** Create a central repo for the app to store state interface  */
import { ActionReducerMap } from '@ngrx/store';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
}

/** export the ActionReducerMap to pass into the StoreModule.forRoot() inside App Module
 * ActionReducerMap is a generic interface, define the type it shall resolve
 */
export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
};
