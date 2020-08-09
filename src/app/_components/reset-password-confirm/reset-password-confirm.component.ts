import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AlertService } from 'src/app/_services';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match'



@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss']
})
export class ResetPasswordConfirmComponent implements OnInit {

  uid: string;
  token: string;
  resetPasswordForm: FormGroup;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uid = params['uid'];
      this.token = params['token'];
    })
    this.resetPasswordForm = this.formBuilder.group({
      new_password1: ['', [Validators.required, Validators.minLength(8)]],
      new_password2: ['', [Validators.required, Validators.minLength(8)]],
    }, {
      validator: MustMatch('new_password1', 'new_password2')
    });
  }

  onSubmit() {

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.resetPassword(this.uid, this.token, this.resetPasswordForm.get('new_password1').value, this.resetPasswordForm.get('new_password2').value)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['./', { outlets: { primary: 'reset-password/complete', view: null } }])
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
