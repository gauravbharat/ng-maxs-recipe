/** Add a token param to all outgoing requests to the firebase database */

import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, take, map } from 'rxjs/operators';

import { AppState } from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private _store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /** The Take(1) rxjs operator informs angular that we wish to take just 1 value and unsubscribe from the subscription.
     *
     * Returning from subscribe does not work, so how to wait and pass the user token, and return the next.handle() observable??
     * Solution: We need to pipe the authUser observable and the next.handle() observable into one big observable
     *
     * exhaustMap operator:
     * 1. exhaustMap will wait for the authUser observable to complete, after we take the latest user and then unsubscribe from it (authUser)
     * 2. pass that user in the exhaustMap, and return the http observable.
     * 3. exhauseMap replaces the outer observable (authUser) with the inner observable(next.handle) in the observable chain, and in the end
     * the inner observable (next.handle) is returned to the observer
     */
    return this._store.select('auth').pipe(
      take(1),
      map((authState) => {
        // Return only the user value from the Auth State
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) return next.handle(req);

        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user?.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
