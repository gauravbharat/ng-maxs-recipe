import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private _router: Router, private _store: Store<AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this._store.select('auth').pipe(
      // take(1): Ensure we only listen to the latest value and unsubscribe.
      take(1),
      map((authState) => {
        const isAuth = !!authState.user;
        if (isAuth) return true;

        return this._router.createUrlTree(['/auth']);
      })
      // Use the above approach instead of manually redirecting using a Urltree
      // tap((isAuth) => {
      //   if (!isAuth) this._router.navigate(['/auth']);
      // })
    );
  }
}
