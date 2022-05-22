import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';
import { evaluate } from 'mathjs'
import { ConfirmDeleteDialogComponent } from 'src/app/_components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  editItemForm: FormGroup;
  submitted = false;
  loading = false;
  units = this.editItem.units;
  weightUnits = this.editItem.weightUnits

  constructor(
    private formBuilder: FormBuilder,
    public editItemRef: MatDialogRef<EditItemComponent>,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public editItem: Item,
    public confirmDeleteItemDialog: MatDialog) { }

  onNoClick(): void {
    this.editItemRef.close();
  }

  ngOnInit(): void {
    this.editItemForm = this.formBuilder.group({
      sku: [this.editItem.sku, []],
      description: [this.editItem.description, [Validators.required]],
      length: [this.editItem.length, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      width: [this.editItem.width, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      height: [this.editItem.height, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      weight: [this.editItem.weight, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]]

    });
  }

  //ngAfterViewInit(): void {
  // this.editItemForm.controls.length.setValue(evaluate(this.editItem.length))
  // this.editItemForm.controls.width.setValue(evaluate(this.editItem.width))
  // this.editItemForm.controls.height.setValue(evaluate(this.editItem.height))
  //}

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editItemForm.invalid) {
      return;
    }
    //evaluate expression
    this.editItemForm.controls.height.setValue(evaluate(this.editItemForm.controls.height.value))
    this.editItemForm.controls.length.setValue(evaluate(this.editItemForm.controls.length.value))
    this.editItemForm.controls.width.setValue(evaluate(this.editItemForm.controls.width.value))
    this.editItemForm.controls.weight.setValue(evaluate(this.editItemForm.controls.weight.value))

    //remove errors
    this.editItemForm.controls.height.setErrors(null)
    this.editItemForm.controls.length.setErrors(null)
    this.editItemForm.controls.width.setErrors(null)
    this.editItemForm.controls.weight.setErrors(null)

    this.editItem = { ...this.editItem, ...this.editItemForm.value }
    this.editItem.units = this.units
    this.editItem.weightUnits = this.weightUnits
    this.loading = true;
    this.itemsService.putItem(this.editItem).subscribe(editItem => this.editItemRef.close({ deletedItem: null, editedItem: editItem }))
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.confirmDeleteItemDialog.open(ConfirmDeleteDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: 'item' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.delete) {
          this.itemsService.deleteItem(this.editItem).subscribe(() => this.editItemRef.close({ deletedItem: this.editItem, editedItem: null }))
        }
      }
    })
  }

  close() {
    this.editItemRef.close({ deletedItem: null, editedItem: null });
  }

  delete() {
    this.submitted = true;
    this.loading = true;
    this.openConfirmDeleteDialog()
  }

}

