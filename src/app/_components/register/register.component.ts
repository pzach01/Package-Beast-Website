import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match'
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { faFacebookSquare, faTwitterSquare, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons'
import { AlertService, AuthenticationService } from '../../_services';

// import { SocialAuthService } from "angularx-social-login";
import { environment } from 'src/environments/environment';
declare let gtag: Function;

@Component({ styleUrls: ['register.component.scss'], templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit, AfterViewInit {
    loginWithGoogleClicked: boolean = false;
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
        public router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private recaptchaV3Service: ReCaptchaV3Service,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2,
        // private authService: SocialAuthService
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                gtag('config', 'UA-111683104-2',
                    {
                        'page_path': event.urlAfterRedirects
                    }
                );
                gtag('config', 'AW-445804472'),
                {
                    'page_path': event.urlAfterRedirects
                };
            }
        })
    }


    ngOnInit() {

        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = "https://accounts.google.com/gsi/client";
        script.defer = true;
        script.async = true;
        this.renderer.appendChild(document.body, script);

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


        // this.authService.authState.subscribe((user) => {
        //     this.authenticationService.socialLogin(user.authToken).subscribe(() => {
        //         if (this.loginWithGoogleClicked) {
        //             this.authenticationService.getUser().pipe(first()).subscribe(() => {
        //                 this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
        //             })
        //         }
        //     })
        // });
    }

    googleCallback(response) {
        this.authenticationService.socialLogin(response.credential).subscribe(() => {
            this.authenticationService.getUser().subscribe(() => {
                // this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);

                // Not sure why we need to navigate to dashboard like this... Clearly an authentication, guard, or navigation bug.
                // Maybe a smart person will be able to identify and fix this in the future.
                // If so, contact Peter and I will by you a beer.
                // this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }])
                window.location.href = window.location.protocol + '//' + window.location.host + '/dashboard(view:inventory)'

            })
        })
    }

    goToRegister() {
        this.router.navigate(['/register']);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
    goHome() {
        this.router.navigate(['/']);
    }
    goToPricing() {
        this.router.navigate(['/pricing']);
    }
    goToFeatures() {
        this.router.navigate(['/features']);
    }

    signInWithGoogle(): void {
        console.log("clicked")
        this.loginWithGoogleClicked = true;
        const googleLoginOptions = {
            scope: 'profile email'
        }
        // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);
    }

    ngAfterViewInit(): void {
        // this.googleInit();
        this.cdr.detectChanges();

        //@ts-ignore
        window.onGoogleLibraryLoad = () => {
            //@ts-ignore
            google.accounts.id.initialize({
                client_id: environment.GOOGLE_CLIENT_ID_URI,
                callback: this.googleCallback.bind(this),
                scope: 'profile email',
                auto_select: false,
                cancel_on_tap_outside: true
            });
            this.formatLoginWithGoogleButton();
            //@ts-ignore
            google.accounts.id.prompt(); // also display the One Tap dialog
        }

        addEventListener('resize', (event) => {
            this.formatLoginWithGoogleButton();
        })
    }

    formatLoginWithGoogleButton() {
        const e = document.getElementById("googleBtnContainer")
        console.log(e.offsetWidth)

        //@ts-ignore
        google.accounts.id.renderButton(
            document.getElementById("loginwithGoogleButtonDiv"),
            { theme: "outline", size: "large", logo_alignment: "center", width: e.offsetWidth }  // customization attributes
        );
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
