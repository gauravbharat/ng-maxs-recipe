import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: [
    `
      input.ng-invalid.ng-touched {
        border: 1px solid red;
      }
    `,
  ],
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoginMode = true; // Component specific property, no effect elsewhere
  isLoading = false;
  error: string = null;

  /** Pass the directive name to the ViewChild to get the ref to its first found instance.
   * {static: false} is set by default */
  @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

  private _authSub$: Subscription;
  private _closeErrorSub$: Subscription;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _store: Store<AppState>
  ) {}

  ngOnInit() {
    this._authSub$ = this._store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) this._showErrorAlert(this.error);
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    this.error = null;
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      // login
      this._store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      // signup
      this._store.dispatch(new AuthActions.SignupStart({ email, password }));
    }
  }

  onHandleError(): void {
    //reset error
    this._store.dispatch(new AuthActions.ClearError());
  }

  private _showErrorAlert(errorMessage: string) {
    // dynamically create alert component
    // const alertCmp = new AlertComponent() WON'T WORK
    // Use resolver to get access to component factory
    const alertComponentFactory = this._componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    // ViewContainer allows to interact with that place in the DOM
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    // clear everything on that view container place before rendering anything new
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(
      alertComponentFactory
    );

    componentRef.instance.message = errorMessage;
    this._closeErrorSub$ = componentRef.instance.close.subscribe(() => {
      this._closeErrorSub$?.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    this._authSub$?.unsubscribe();
    this._closeErrorSub$?.unsubscribe();
  }
}
