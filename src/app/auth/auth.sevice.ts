import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _timerRef: any;

  constructor(private _store: Store<AppState>) {}

  setLogoutTimer(expirationDuration: number): void {
    this._timerRef = setTimeout(() => {
      this._store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer(): void {
    if (this._timerRef) {
      clearTimeout(this._timerRef);
      this._timerRef = null;
    }
  }
}
