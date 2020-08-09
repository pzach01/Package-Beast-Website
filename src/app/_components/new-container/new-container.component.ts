import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';
import { evaluate } from 'mathjs'
import { AuthenticationService } from 'src/app/_services';


@Component({
  selector: 'app-new-container',
  templateUrl: './new-container.component.html',
  styleUrls: ['./new-container.component.scss']
})
export class NewContainerComponent implements OnInit {
  newContainerForm: FormGroup;
  submitted = false;
  loading = false;
  currentUser = this.authenticationService.currentUserValue;
  units = this.currentUser.units

  constructor(
    private formBuilder: FormBuilder,
    public newContainerRef: MatDialogRef<NewContainerComponent>,
    private containersService: ContainersService,
    @Inject(MAT_DIALOG_DATA) public newContainer: Container,
    private authenticationService: AuthenticationService) { }

  onNoClick(): void {
    this.newContainerRef.close();
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.newContainerForm = this.formBuilder.group({
      sku: ['', []],
      description: ['', [Validators.required]],
      xDim: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      yDim: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      zDim: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]]
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newContainerForm.invalid) {
      return;
    }

    //evaluate expression
    this.newContainerForm.controls.xDim.setValue(evaluate(this.newContainerForm.controls.xDim.value))
    this.newContainerForm.controls.yDim.setValue(evaluate(this.newContainerForm.controls.yDim.value))
    this.newContainerForm.controls.zDim.setValue(evaluate(this.newContainerForm.controls.zDim.value))
    //remove errors
    this.newContainerForm.controls.xDim.setErrors(null)
    this.newContainerForm.controls.yDim.setErrors(null)
    this.newContainerForm.controls.zDim.setErrors(null)

    this.newContainer = new Container(this.newContainerForm.value)
    this.loading = true;
    this.containersService.postContainer(this.newContainer).subscribe(newContainer => this.newContainerRef.close(newContainer))
  }

  close() {
    this.newContainerRef.close();
  }

}
