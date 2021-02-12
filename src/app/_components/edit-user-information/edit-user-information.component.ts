import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-edit-user-information',
  templateUrl: './edit-user-information.component.html',
  styleUrls: ['./edit-user-information.component.scss']
})
export class EditUserInformationComponent implements OnInit {
  changeUserInformationForm: FormGroup;
  currentUser: User
  saveStatusText: string = ""
  save$: Subscription

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.changeUserInformationForm = this.formBuilder.group({
      first_name: [this.currentUser.first_name],
      last_name: [this.currentUser.last_name]
    });
  }

  save() {
    if (this.save$ != undefined) {
      this.save$.unsubscribe();
    }
    this.saveStatusText = "Saving"
    const source = interval(500)
    const numAttempts = source.pipe(take(1))
    this.save$ = numAttempts.subscribe(() => {

      this.authenticationService.updateUser({
        first_name: this.changeUserInformationForm.get('first_name').value,
        last_name: this.changeUserInformationForm.get('last_name').value
      })
        .subscribe(() => this.saveStatusText = "Settings Saved!")
    })
  }

}
