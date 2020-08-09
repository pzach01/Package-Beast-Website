import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match'

import { AlertService, UserService, AuthenticationService } from '../../_services';

@Component({ styleUrls: ['register.component.scss'], templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
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
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            password1: ['', [Validators.required, Validators.minLength(8)]],
            password2: ['', [Validators.required, Validators.minLength(8)]],
        }, {
            validator: MustMatch('password1', 'password2')
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.registerForm.get('email').value, this.registerForm.get('first_name').value, this.registerForm.get('last_name').value, this.registerForm.get('password1').value, this.registerForm.get('password2').value)
            .pipe(first())
            .subscribe(
                () => {
                    this.authenticationService.getUser().pipe(first()).subscribe(() => this.router.navigate(['./', { outlets: { view: ['items'] } }]))
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
