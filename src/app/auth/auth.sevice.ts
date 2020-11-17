import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string; // A Firebase Auth ID token for the newly created user.
  email: string; //The email for the newly created user.
  refreshToken: string; //A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //The number of seconds in which the ID token expires.
  localId: string; //The uid of the newly created user.
  registered?: boolean; //Whether the email is for an existing account.
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // BehaviorSubject: Shall retain a value even after the event is emitted
  authUser = new BehaviorSubject<User>(null);
  private _timerRef: any;

  constructor(private _http: HttpClient, private _router: Router) {}

  signup(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}
    `,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        /** catchError(): Instead of handling error response in the component, handle it here before it reaches subscribe */
        catchError(this._handleError),
        /** tap(): Perform some operations without changing the response */
        // tap(this._handleAuthentication)
        tap((resData) =>
          this._handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  login(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}
    `,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        /** Instead of handling error response in the component, handle it here before it reaches subscribe */
        catchError(this._handleError),
        /** tap(): Perform some operations without changing the response */
        // tap(this._handleAuthentication)
        tap((resData) =>
          this._handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  autoLogin() {
    // Deserialize: string userData to JS object
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    // console.log('autoLogin', userData);
    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.authUser.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.authUser.next(null);
    localStorage.removeItem('userData');
    this._timerRef && clearTimeout(this._timerRef);
    this._router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this._timerRef = setTimeout(() => {
      this.logout;
    }, expirationDuration);
  }

  private _handleAuthentication(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.authUser.next(user);
    this.autoLogout(expiresIn * 1000);
    // Serialize user data object, i.e. convert to string before storing to local storage
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /** Passing _handleAuthentication as a function argument to tap failed, since the authUser subject was ALWAYS undefined */
  // private _handleAuthentication(resData: AuthResponseData) {
  //   const { email, localId, idToken, expiresIn } = resData;
  //   const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  //   const user = new User(email, localId, idToken, expirationDate);
  //   console.log(this.authUser);
  //   // this.authUser.next(user);
  // }

  private _handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    console.log('_handleError', errorResponse);

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

    return throwError(errorMessage);
  }
}
