import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
// import { SocialAuthService } from 'angularx-social-login';
// import { GoogleLoginProvider } from "angularx-social-login";
import { environment } from 'src/environments/environment';

declare const gapi: any;
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
        // private authService: SocialAuthService
        private elementRef: ElementRef
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


        addEventListener('resize', (event) => {
            const e = document.getElementById("googleBtnContainer")
            console.log(e.offsetWidth)

            //@ts-ignore
            google.accounts.id.renderButton(
                document.getElementById("loginwithGoogleButtonDiv"),
                { theme: "outline", size: "large", logo_alignment: "center", width: e.offsetWidth }  // customization attributes
            );
        })




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

    // public auth2: any;
    // public googleInit() {
    //     gapi.load('auth2', () => {
    //         this.auth2 = gapi.auth2.init({
    //             client_id: environment.GOOGLE_CLIENT_ID_URI,
    //             // cookiepolicy: 'single_host_origin',
    //             scope: 'profile email',
    //             redirect_uri: `${environment.CLIENT_BASE_URI}}/login`
    //         });
    //         this.attachSignin(document.getElementById('googleBtn'));
    //     });
    // }
    // public attachSignin(element) {
    //     this.auth2.attachClickHandler(element, {},
    //         (googleUser) => {

    //             let profile = googleUser.getBasicProfile();
    //             // console.log(googleUser.getAuthResponse())
    //             // console.log('Token || ' + googleUser.getAuthResponse().id_token);
    //             // console.log('ID: ' + profile.getId());
    //             // console.log('Name: ' + profile.getName());
    //             // console.log('Image URL: ' + profile.getImageUrl());
    //             // console.log('Email: ' + profile.getEmail());
    //             //YOUR CODE HERE


    //             this.authenticationService.socialLogin(googleUser.getAuthResponse().access_token).subscribe(() => {
    //                 this.authenticationService.getUser().pipe(first()).subscribe(() => {
    //                     // Not sure why we need to navigate to dashboard like this... Clearly an authentication, guard, or navigation bug.
    //                     // Maybe a smart person will be able to identify and fix this in the future.
    //                     // If so, contact Peter and I will by you a beer.
    //                     // this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }])
    //                     window.location.href = window.location.protocol + '//' + window.location.host + '/dashboard(view:inventory)'
    //                 })

    //             })

    //         }, (error) => {
    //             // console.log(error);
    //         });
    // }


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
    ngAfterViewInit() {
        // this.googleInit();
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://accounts.google.com/gsi/client";
        this.elementRef.nativeElement.appendChild(s);

        const e = document.getElementById("googleBtnContainer")

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
            //@ts-ignore
            google.accounts.id.renderButton(
                document.getElementById("loginwithGoogleButtonDiv"),
                { theme: "outline", size: "large", logo_alignment: "center", width: e.offsetWidth }  // customization attributes
            );
            // //@ts-ignore
            // google.accounts.id.prompt(); // also display the One Tap dialog
        }
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
