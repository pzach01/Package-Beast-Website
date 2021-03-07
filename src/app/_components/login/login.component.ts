import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
declare const gapi: any;

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
    ) { }

    public auth2: any;
    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '1085639833940-huu83eh91v26dcpkt8qvu1or4ikr0t1n.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email',
            });
            this.attachSignin(document.getElementById('googleBtn2'));
        });
    }
    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {

                let profile = googleUser.getBasicProfile();
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                //YOUR CODE HERE

            }, (error) => {
                console.log(JSON.stringify(error, undefined, 2));
            });
    }

    ngAfterViewInit() {
        this.googleInit();
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
