import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../../_services';

@Component({ selector: 'app-login', templateUrl: 'login.component.html', styleUrls: ['./login.scss'] })

export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.loginForm = this.formBuilder.group({
            email: ['', [this.loginFailValidator, Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [this.loginFailValidator, Validators.required]],
        });


        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.formControlValueChanged();
    }


    loginFailValidator(): void { }

    formControlValueChanged() {
        this.loginForm.get('email').valueChanges.subscribe(
            (abc) => {
                console.log(abc)
                this.removeError(this.loginForm.controls['email'], "loginFail")
                this.removeError(this.loginForm.controls['password'], "loginFail")
            });
        this.loginForm.get('password').valueChanges.subscribe(
            (abc) => {
                console.log(abc)
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

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
            .pipe(first())
            .subscribe(
                () => {
                    this.authenticationService.getUser().pipe(first()).subscribe(() => this.router.navigate(['./', { outlets: { view: ['items'] } }])
                    )
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    this.submitted = false;
                    this.loginForm.controls['email'].setErrors({ loginFail: true });
                    this.loginForm.controls['password'].setErrors({ loginFail: true });
                });
    }
}
