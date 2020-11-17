import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { pipe, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.sevice';
import { DataStorageService } from '../shared/data-storage.service';
import { AppState } from '../store/app.reducer';

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
  // @Output() featureSelected = new EventEmitter<string>();

  // // onSelectMenu(feature: string) {
  // //   this.featureSelected.emit(feature);
  // // }

  constructor(
    private _dataStorageService: DataStorageService,
    private _authService: AuthService,
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
    this._authService.logout();
  }

  ngOnDestroy() {
    this._fetchDataSub$?.unsubscribe();
    this._userSub$.unsubscribe();
  }
}
