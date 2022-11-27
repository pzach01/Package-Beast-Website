import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../../_services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  passwordResetForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.passwordResetForm = this.formBuilder.group({
      email: ['', [this.passwordResetFailValidator, Validators.required, Validators.pattern(EMAIL_REGEX)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.formControlValueChanged();
  }

  passwordResetFailValidator(): void { }

  formControlValueChanged() {
    this.passwordResetForm.get('email').valueChanges.subscribe(
      () => {
        this.removeError(this.passwordResetForm.controls['email'], "passwordResetFail")
      });
  }

  removeError(control: AbstractControl, error: string) {
    const err = control.errors; // get control errors
    if (err) {
      delete err[error]; // delete your own error
      if (!Object.keys(err).length) { // if no errors left
        control.setErrors(null); // set control errors to null making it VALID
      } else {
        control.setErrors(err); // controls got other errors so set them back
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.passwordResetForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.sendPasswordResetEmail(this.passwordResetForm.get('email').value)
      .pipe(first())
      .subscribe(
        () => {
          // this.router.navigate([{ outlets: { primary: 'reset-password/done' } }]);
          this.router.navigate(['done'], { relativeTo: this.route });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
          this.submitted = false;
          this.passwordResetForm.controls['email'].setErrors({ passwordResetFail: true });
        });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  goToPricing() {
    this.router.navigate(['/pricing']);
  }
  goToFeatures() {
    this.router.navigate(['/features']);
  }
  goHome() {
    this.router.navigate(['/']);
  }

}
