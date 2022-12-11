import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';
import { AuthenticationService } from 'src/app/_services';
import { CreateFailDialogComponent } from '../create-fail-dialog/create-fail-dialog.component';
import { evaluateDimension, DimensionInput } from 'src/app/_helpers/evaluate-dimension';


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {
  newItemForm: FormGroup;
  submitted = false;
  loading = false;
  currentUser = this.authenticationService.currentUserValue;
  units = this.currentUser.units
  weightUnits = this.currentUser.weightUnits;

  constructor(
    private formBuilder: FormBuilder,
    public newItemRef: MatDialogRef<NewItemComponent>,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public newItem: Item,
    private authenticationService: AuthenticationService,
    public createFailDialog: MatDialog) { }

  onNoClick(): void {
    this.newItemRef.close();
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.newItemForm = this.formBuilder.group({
      sku: ['', []],
      description: ['', [Validators.required]],
      height: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      length: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      width: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      weight: ['', [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]]
    });
  }

  save() {
    this.submitted = true;
    this.loading = true;

    const formControls = [this.newItemForm.controls.height, this.newItemForm.controls.length, this.newItemForm.controls.width, this.newItemForm.controls.weight]
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
    if (this.newItemForm.invalid) {
      return;
    }

    //evaluate expression
    // this.newItemForm.controls.height.setValue(evaluate(this.newItemForm.controls.height.value))
    // this.newItemForm.controls.length.setValue(evaluate(this.newItemForm.controls.length.value))
    // this.newItemForm.controls.width.setValue(evaluate(this.newItemForm.controls.width.value))
    // this.newItemForm.controls.weight.setValue(evaluate(this.newItemForm.controls.weight.value))
    //remove errors
    this.newItemForm.controls.height.setErrors(null)
    this.newItemForm.controls.length.setErrors(null)
    this.newItemForm.controls.width.setErrors(null)
    this.newItemForm.controls.weight.setErrors(null)

    this.newItem = new Item(this.newItemForm.value)
    this.newItem.units = this.units

    this.newItem.weightUnits = this.weightUnits

    this.itemsService.postItem(this.newItem).subscribe(newItem => {
      this.newItemRef.close(newItem);
    }, error => { this.close(); this.openCreateFailDialog(); }
    )
  }

  openCreateFailDialog(): void {
    const dialogRef = this.createFailDialog.open(CreateFailDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: "item" },
    });
  }
  close() {
    this.newItemRef.close();
  }

}
