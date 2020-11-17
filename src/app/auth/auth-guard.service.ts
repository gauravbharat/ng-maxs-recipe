import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.sevice';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this._authService.authUser.pipe(
      // take(1): Ensure we only listen to the latest value and unsubscribe.
      take(1),
      map((user) => {
        const isAuth = !!user;
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
