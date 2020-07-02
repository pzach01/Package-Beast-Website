import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/_models/container';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/_services/containers.service';
import { evaluate } from 'mathjs'


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
    @Inject(MAT_DIALOG_DATA) public editContainer: Container) { }

  onNoClick(): void {
    this.editContainerRef.close();
  }

  ngOnInit(): void {
    this.editContainerForm = this.formBuilder.group({
      sku: [this.editContainer.sku, []],
      description: [this.editContainer.description, [Validators.required]],
      xDim: [null, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      yDim: [null, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      zDim: [null, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]]
    }, { updateOn: 'change' });
  }

  ngAfterViewInit(): void {
    this.editContainerForm.controls.xDim.setValue(this.editContainer.xDim)
    this.editContainerForm.controls.yDim.setValue(this.editContainer.yDim)
    this.editContainerForm.controls.zDim.setValue(this.editContainer.zDim)
  }

  save() {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.editContainerForm.invalid) { return; }

    //evaluate expression
    this.editContainerForm.controls.xDim.setValue(evaluate(this.editContainerForm.controls.xDim.value))
    this.editContainerForm.controls.yDim.setValue(evaluate(this.editContainerForm.controls.yDim.value))
    this.editContainerForm.controls.zDim.setValue(evaluate(this.editContainerForm.controls.zDim.value))
    //remove errors
    this.editContainerForm.controls.xDim.setErrors(null)
    this.editContainerForm.controls.yDim.setErrors(null)
    this.editContainerForm.controls.zDim.setErrors(null)

    this.editContainer = { ...this.editContainer, ...this.editContainerForm.value }

    this.editContainer.units = this.units
    this.containersService.putContainer(this.editContainer).subscribe(editContainer => this.editContainerRef.close({ deletedContainer: null, editedContainer: editContainer }))
  }

  close() {
    this.editContainerRef.close({ deletedContainer: null, editedContainer: null });
  }

  delete() {
    this.submitted = true;
    this.loading = true;
    this.containersService.deleteItem(this.editContainer).subscribe(() => this.editContainerRef.close({ deletedContainer: this.editContainer, editedContainer: null }))
  }

}

