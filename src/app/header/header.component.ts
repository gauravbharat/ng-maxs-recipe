import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataStorageService } from '../shared/data-storage.service';

import { AppState } from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: '../header/header.component.html',
  styles: [
    `
      a {
        cursor: pointer;
      }
    `,
  ],
})
export class HeaderComponent implements OnDestroy, OnInit {
  collapsed = true;
  isAuthenticated = false;
  private _fetchDataSub$: Subscription;
  private _userSub$: Subscription;

  constructor(
    private _dataStorageService: DataStorageService,
    private _store: Store<AppState>
  ) {}

  ngOnInit() {
    this._userSub$ = this._store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData(): void {
    this._dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    this._fetchDataSub$ = this._dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(): void {
    this._store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this._fetchDataSub$?.unsubscribe();
    this._userSub$.unsubscribe();
  }
}
