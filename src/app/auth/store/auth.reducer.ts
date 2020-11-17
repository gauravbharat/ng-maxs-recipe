/** Reducer for Auth. Should only have those actions that are related to the state,
 * no side-effects (e.g. http, localStorage, etc.) since reducer does not support async code
 * side-effects should be handled by NgRx effects separately
 */

import { User } from '../user.model';
import * as AuthActions from './auth.actions';

/** Determine the state actors that need to be present here */
export interface State {
  user: User;
}

const initialState: State = {
  user: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActionTypes
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );

      return {
        ...state,
        user,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    /** Important for initialisation of State */
    default:
      return { ...state };
  }
}
