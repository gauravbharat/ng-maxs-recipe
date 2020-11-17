/** Reducer: Data-in => DataCopy-out, all synchronous and NO async code here */

import { Ingredient } from '../../shared/ingredient.model';
import * as SLA from './shopping-list.actions';

/** Create a interface for the type of state this reducer would handle.
 * Use this interface at those places where the ngrx Store 'shoppingList' is used
 */
export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: ShoppingListState;
}

/** Create an initial state for shopping-list, an initial array of ingredients
 *
 * Add more initial state to store the editedIngredient index and value. This is to replace the use of Subject from
 * the ShoppingList service to know the item selected in the shopping list and observe it in the shopping edit component.
 * This will now be handled by dispatching a state from the shopping list component for the selected item, then observing that
 * in that shopping edit component
 */
const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

/** Create a state combiner, 'Reducer' function for shopping-list
 *
 * Takes two important arguments, which the 'NgRx' package would pass -
 * 1. state: the current state before it was changed
 * 2. action (of ngrx/store Action type): the action that triggered this reducer and the state update
 *
 * Find out the action and update the state accordingly,
 * without mutating current state it and returning a reduced state copy
 *
 * Set state argument to initialState, for the first time/initial run
 */
export function shoppingListReducer(
  state = initialState,
  action: SLA.ShoppingListActions
) {
  switch (action.type) {
    case SLA.ADD_INGREDIENT:
      // Never touch the existing state, always copy the old state and return a combined state
      // Combine new ingredient value with the old ingredients array state and return a copy
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case SLA.ADD_INGREDIENTS:
      // Combine/Spread new ingredients array with the old ingredients array state and return a copy
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case SLA.UPDATE_INGREDIENT:
      // Get the ingredient record from the array
      const ingredient = state.ingredients[state.editedIngredientIndex];

      /** Copy and change to retain data like IDs etc when overriding old array record */
      const updatedIngredient = {
        ...ingredient,
        ...action.payload,
      };

      // Create a copy of the existing array/state and replace the updated record
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case SLA.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (ingredient, index) => index !== state.editedIngredientIndex
        ),
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case SLA.START_EDIT:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload] },
        editedIngredientIndex: action.payload,
      };

    case SLA.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    default:
      return { ...state };
  }
}
