import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from "angularx-social-login";


@Component({ selector: 'app-login', templateUrl: 'login.component.html', styleUrls: ['./login.scss'] })

export class LoginComponent implements OnInit {
    loginWithGoogleClicked: boolean = false;
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private authService: SocialAuthService
    ) { }

    ngOnInit() {
        const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.loginForm = this.formBuilder.group({
            email: ['', [this.loginFailValidator, Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [this.loginFailValidator, Validators.required]],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.formControlValueChanged();

        this.authService.authState.subscribe((user) => {
            this.authenticationService.socialLogin(user.authToken).subscribe(() => {
                if (this.loginWithGoogleClicked) {
                    this.authenticationService.getUser().pipe(first()).subscribe(() => {
                        this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
                    })
                }
            })
        });
    }

    loginFailValidator(): void { }

    signInWithGoogle(): void {
        this.loginWithGoogleClicked = true;
        const googleLoginOptions = {
            scope: 'profile email',
            redirect_uri: "https://development.packagebeast.com/login",
        }
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);
    }

    formControlValueChanged() {
        this.loginForm.get('email').valueChanges.subscribe(
            () => {
                this.removeError(this.loginForm.controls['email'], "loginFail")
                this.removeError(this.loginForm.controls['password'], "loginFail")
            });
        this.loginForm.get('password').valueChanges.subscribe(
            () => {
                this.removeError(this.loginForm.controls['email'], "loginFail")
                this.removeError(this.loginForm.controls['password'], "loginFail")
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

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
            .pipe(first()).subscribe(() => {
                this.authenticationService.getUser().pipe(first()).subscribe(() => {
                    this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
                })
            },
                error => {
                    this.loading = false;
                    this.submitted = false;
                    this.loginForm.controls['email'].setErrors({ loginFail: true });
                    this.loginForm.controls['password'].setErrors({ loginFail: true });
                });
    }
}
