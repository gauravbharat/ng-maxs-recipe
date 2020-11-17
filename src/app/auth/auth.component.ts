import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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

  private _authSub$: Subscription;

  constructor(private _authService: AuthService, private _router: Router) {}

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
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this._authSub$?.unsubscribe();
  }
}
