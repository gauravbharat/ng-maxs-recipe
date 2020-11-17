import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.sevice';

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
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  /** Pass the directive name to the ViewChild to get the ref to its first found instance.
   * {static: false} is set by default */
  @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

  private _authSub$: Subscription;
  private _closeErrorSub$: Subscription;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    this.error = null;
    if (!form.valid) return;

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      // login
      authObs = this._authService.login(email, password);
    } else {
      // signup
      authObs = this._authService.signup(email, password);
    }

    this._authSub$ = authObs.subscribe(
      (resData) => {
        this.isLoading = false;
        console.log(`${this.isLoginMode ? 'login' : 'signup'}`, resData);
        form.reset();
        this._router.navigate(['/recipes']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this._showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );
  }

  onHandleError(): void {
    //reset error
    this.error = null;
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
