import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';
import { AuthenticationService } from 'src/app/_services';
import { CreateFailDialogComponent } from '../create-fail-dialog/create-fail-dialog.component';
import { evaluateDimension, DimensionInput } from 'src/app/_helpers/evaluate-dimension';


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
    private authenticationService: AuthenticationService,
    public createFailDialog: MatDialog) { }

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

    const formControls = [this.newContainerForm.controls.xDim, this.newContainerForm.controls.yDim, this.newContainerForm.controls.zDim]
    formControls.forEach(control => {
      let evaluatedDimension: DimensionInput = evaluateDimension(control.value)
      console.log(evaluatedDimension)
      if (evaluatedDimension.error == null) {
        control.setValue(evaluatedDimension.value);
      } else {
        const e = evaluatedDimension.error
        control.setErrors({ [e]: true })
      }
    })

    // stop here if form is invalid
    if (this.newContainerForm.invalid) {
      return;
    }

    //evaluate expression
    // this.newContainerForm.controls.xDim.setValue(evaluate(this.newContainerForm.controls.xDim.value))
    // this.newContainerForm.controls.yDim.setValue(evaluate(this.newContainerForm.controls.yDim.value))
    // this.newContainerForm.controls.zDim.setValue(evaluate(this.newContainerForm.controls.zDim.value))
    //remove errors
    this.newContainerForm.controls.xDim.setErrors(null)
    this.newContainerForm.controls.yDim.setErrors(null)
    this.newContainerForm.controls.zDim.setErrors(null)

    this.newContainer = new Container(this.newContainerForm.value)
    this.loading = true;
    this.newContainer.units = this.units
    this.containersService.postContainer(this.newContainer).subscribe(newContainer => {
      this.newContainerRef.close(newContainer)
    },
      error => {
        this.close(); this.openCreateFailDialog();
      })
  }

  openCreateFailDialog(): void {
    const dialogRef = this.createFailDialog.open(CreateFailDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: "container" },
    });
  }

  close() {
    this.newContainerRef.close();
  }

}
