import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { MustMatch } from 'src/app/_helpers/must-match';
import { first } from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  serverPasswordError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
    }, {
      validator: MustMatch('password1', 'password2')
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.changePassword(this.changePasswordForm.get('password1').value, this.changePasswordForm.get('password2').value)
      .pipe(first())
      .subscribe(
        (r) => {
          this.loading = false;
          this.submitted = false;
        },
        error => {
          this.loading = false;
          this.submitted = false;

          if (error.new_password2) {
            error.new_password2.forEach(passwordError => {
              this.changePasswordForm.controls['password1'].setErrors({ changePasswordFail: true });
              this.serverPasswordError = passwordError;
            });
          }
        });
  }

}
