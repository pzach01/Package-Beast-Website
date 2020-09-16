import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match'
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { AlertService, AuthenticationService } from '../../_services';

@Component({ styleUrls: ['register.component.scss'], templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    serverEmailError: string = "";
    serverPasswordError: string = "";
    serverRecaptchaError: string = "";


    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private recaptchaV3Service: ReCaptchaV3Service
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            password1: ['', [Validators.required, Validators.minLength(8)]],
            password2: ['', [Validators.required, Validators.minLength(8)]]
        }, {
            validator: MustMatch('password1', 'password2')
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    registerUser(recaptchaToken) {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.registerForm.get('email').value, this.registerForm.get('first_name').value, this.registerForm.get('last_name').value, this.registerForm.get('password1').value, this.registerForm.get('password2').value, recaptchaToken)
            .pipe(first())
            .subscribe(
                () => {
                    console.log("success")
                    this.router.navigate(['/register-done'])
                },
                error => {
                    this.loading = false;
                    console.log("errror from register componenet", error)
                    if (error.email) {
                        error.email.forEach(emailError => {
                            this.registerForm.controls['email'].setErrors({ registerFail: true });
                            this.serverEmailError = emailError;
                        });
                    }
                    if (error.password1) {
                        error.password1.forEach(passwordError => {
                            this.registerForm.controls['password1'].setErrors({ registerFail: true });
                            this.serverPasswordError = passwordError;
                        });
                    }
                    if (error.recaptcha_token) {
                        error.recaptcha_token.forEach(recaptchaError => {
                            this.serverRecaptchaError = recaptchaError;
                        });
                    }
                    console.log("ReCap error?", error)
                    // this.alertService.error(error);
                    // this.loading = false;
                });
    }

    handleToken(token) {
        console.log(token)
    }

    onSubmit(): void {
        this.recaptchaV3Service.execute('register')
            .subscribe((recaptchaToken) => { console.log("recapToken", recaptchaToken), this.registerUser(recaptchaToken) });
    }
}
