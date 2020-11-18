import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.sevice';

export interface AuthResponseData {
  idToken: string; // A Firebase Auth ID token for the newly created user.
  email: string; //The email for the newly created user.
  refreshToken: string; //A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //The number of seconds in which the ID token expires.
  localId: string; //The uid of the newly created user.
  registered?: boolean; //Whether the email is for an existing account.
}

/** Inject Actions from @ngrx/store
 * Actions is a type Action, a stream of dispatched actions
 * It is one big observable, which would give access to all the dispatched actions, to whom
 * we can't react to them differently than the reducers
 *
 * Complete the async actions and call the next depending on its result
 */
// // Do not provide this in root, it will never be injected itself but by NgRx Effects
// // Needs injectable for DI in this class
@Injectable()
export class AuthEffects {
  /** Register first effect handling, the action handler
   * Don't call subscribe here, NgRx shall subscribe here for us
   *
   * @Effect decorator is required by the NgRx Effect to pickup this property (authLogin) as an effect
   */

  @Effect()
  authSignup = this._actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this._http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}
    `,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((resData) => {
            return this._handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError((errorResponse) => {
            return this._handleError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this._actions$.pipe(
    /** ofType(): filter that simply allows us which TYPE of effect we want to continue in this observable stream
     * Only continue with this observable stream if the action type is login_start effect
     *
     */
    ofType(AuthActions.LOGIN_START),
    /** swtichMap(): allows to create a new observable by taking another observable's data.
     * Get data from LoginStart action payload and pass it to the post observable
     *
     * An effect at the end should return a new action once it is done.
     * This effect doesn't change the app state, it just should execute some code. It should not touch the reducer or the NgRx Store, as expected.
     *
     * If this effect is successful, dispatch a login action
     */
    switchMap((authData: AuthActions.LoginStart) => {
      // return http observable, after transforming data using rxjs operators
      return this._http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}
    `,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          // Executed on no error, and must not create an error. Return a non-errorneous observable
          map((resData) => {
            return this._handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          // executed on error
          catchError((errorResponse) => {
            /**  handle error here, DO NOT call catchError on the switchMap since on error this observabale shall die
             * Again, super important, return a NON-ERROR Observable, so that our overall stream does not die
             * Return a new, non-error observable using of(), which would be picked-up by switchMap and returned in this overall observable stream
             * Don't call dispatch() here, just return an action and NgRx @Effect shall dispatch it */
            return this._handleError(errorResponse);
          })
        );
    })
  );

  /** For an effect that would not yield a dispatchable action at the end, pass {dispatch: false} to @Effect
   * Redirect to Home page on success and logout */
  @Effect({ dispatch: false })
  authRedirect = this._actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this._router.navigate(['/']);
    })
  );

  /** Auto login effect, from app component */
  @Effect()
  autoLogin = this._actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    /**Use map() operator since tap() won't return anything */
    map(() => {
      // Deserialize: string userData to JS object
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      /** Return dummy action to no-effect */
      if (!userData) return { type: 'DUMMY' };

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
        });
      }
      /** Return dummy action to no-effect */
      return { type: 'DUMMY' };
    })
  );

  /** Clear localStorage and redirect to auth page on logout action */
  @Effect({ dispatch: false })
  authLogout = this._actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this._authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this._router.navigate(['/auth']);
    })
  );

  constructor(
    private _actions$: Actions,
    private _http: HttpClient,
    private _router: Router,
    private _authService: AuthService
  ) {}

  private _handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ): Action {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    /** Persist user session in local storage, serialize User JS to string  */
    localStorage.setItem('userData', JSON.stringify(user));

    /** Set the auto-login-logout timer */
    this._authService.setLogoutTimer(expiresIn * 1000);

    // Automatically gets dispatched by NgRx effect
    return new AuthActions.AuthenticateSuccess({
      email,
      userId,
      token,
      expirationDate,
    });
  }

  private _handleError(
    errorResponse: HttpErrorResponse
  ): Observable<AuthActions.AuthenticateFail> {
    let errorMessage = 'An unknown error occurred!';

    switch (errorResponse?.error?.error?.message) {
      case 'EMAIL_EXISTS':
        errorMessage =
          'The email address is already in use by another account!';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage =
          'Password sign-in is disabled for this project! Please contact the administrator.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Please try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Credentials are incorrect!';
        break;
      case 'USER_DISABLED':
        errorMessage =
          'The user account has been disabled by an administrator.';
      default:
    }

    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
