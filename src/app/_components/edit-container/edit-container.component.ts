import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';
import { ConfirmDeleteDialogComponent } from 'src/app/_components/confirm-delete-dialog/confirm-delete-dialog.component';
import { evaluateDimension, DimensionInput } from 'src/app/_helpers/evaluate-dimension';


@Component({
  selector: 'app-edit-container',
  templateUrl: './edit-container.component.html',
  styleUrls: ['./edit-container.component.scss']
})
export class EditContainerComponent implements OnInit {
  editContainerForm: FormGroup;
  submitted = false;
  loading = false;
  units = this.editContainer.units;

  constructor(
    private formBuilder: FormBuilder,
    public editContainerRef: MatDialogRef<EditContainerComponent>,
    private containersService: ContainersService,
    @Inject(MAT_DIALOG_DATA) public editContainer: Container,
    public confirmDeleteItemDialog: MatDialog) { }

  onNoClick(): void {
    this.editContainerRef.close();
  }

  ngOnInit(): void {
    this.editContainerForm = this.formBuilder.group({
      sku: [this.editContainer.sku, []],
      description: [this.editContainer.description, [Validators.required]],
      xDim: [this.editContainer.xDim, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      yDim: [this.editContainer.yDim, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      zDim: [this.editContainer.zDim, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]]
    }, { updateOn: 'change' });
  }

  // ngAfterViewInit(): void {
  //   this.editContainerForm.controls.xDim.setValue(this.editContainer.xDim)
  //   this.editContainerForm.controls.yDim.setValue(this.editContainer.yDim)
  //   this.editContainerForm.controls.zDim.setValue(this.editContainer.zDim)
  // }

  save() {
    this.submitted = true;
    this.loading = true;

    const formControls = [this.editContainerForm.controls.xDim, this.editContainerForm.controls.yDim, this.editContainerForm.controls.zDim]
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
    if (this.editContainerForm.invalid) { return; }

    //evaluate expression
    // this.editContainerForm.controls.xDim.setValue(evaluate(this.editContainerForm.controls.xDim.value))
    // this.editContainerForm.controls.yDim.setValue(evaluate(this.editContainerForm.controls.yDim.value))
    // this.editContainerForm.controls.zDim.setValue(evaluate(this.editContainerForm.controls.zDim.value))
    //remove errors
    this.editContainerForm.controls.xDim.setErrors(null)
    this.editContainerForm.controls.yDim.setErrors(null)
    this.editContainerForm.controls.zDim.setErrors(null)

    this.editContainer = { ...this.editContainer, ...this.editContainerForm.value }

    this.editContainer.units = this.units
    this.containersService.putContainer(this.editContainer).subscribe(editContainer => this.editContainerRef.close({ deletedContainer: null, editedContainer: editContainer }))
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.confirmDeleteItemDialog.open(ConfirmDeleteDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: 'container' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.delete) {
          this.containersService.deleteItem(this.editContainer).subscribe(() => this.editContainerRef.close({ deletedContainer: this.editContainer, editedContainer: null }))
        }
      }
    })
  }

  close() {
    this.editContainerRef.close({ deletedContainer: null, editedContainer: null });
  }

  delete() {
    this.submitted = true;
    this.loading = true;
    this.openConfirmDeleteDialog();

    // this.containersService.deleteItem(this.editContainer).subscribe(() => this.editContainerRef.close({ deletedContainer: this.editContainer, editedContainer: null }))
  }

}

