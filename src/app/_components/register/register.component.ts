import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match'
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { faFacebookSquare, faTwitterSquare, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons'
import { AlertService, AuthenticationService } from '../../_services';

declare const gapi: any;
@Component({ styleUrls: ['register.component.scss'], templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit, AfterViewInit {
    faFacebookSquare = faFacebookSquare;
    faTwitterSquare = faTwitterSquare;
    faYoutubeSquare = faYoutubeSquare;

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
        private recaptchaV3Service: ReCaptchaV3Service,
        private cdr: ChangeDetectorRef
    ) { }

    public auth2: any;
    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '1085639833940-62ucutrkvt8iu46a544kb5dcm9j8qi54.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });
            this.attachSignin(document.getElementById('googleBtn'));
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
                alert(JSON.stringify(error, undefined, 2));
            });
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

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
        this.googleInit();
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
                    this.router.navigate(['/register-done'])
                },
                error => {
                    this.loading = false;
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
                });
    }

    onSubmit(): void {
        this.recaptchaV3Service.execute('register')
            .subscribe((recaptchaToken) => { this.registerUser(recaptchaToken) });
    }
}
