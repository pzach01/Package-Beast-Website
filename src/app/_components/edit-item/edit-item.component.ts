import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';
import { evaluate } from 'mathjs'

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

  constructor(
    private formBuilder: FormBuilder,
    public editItemRef: MatDialogRef<EditItemComponent>,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public editItem: Item) { }

  onNoClick(): void {
    this.editItemRef.close();
  }

  ngOnInit(): void {
    this.editItemForm = this.formBuilder.group({
      sku: [this.editItem.sku, []],
      description: [this.editItem.description, [Validators.required]],
      length: [this.editItem.length, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      width: [this.editItem.width, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]],
      height: [this.editItem.height, [Validators.required, Validators.pattern(/^[0-9|.|+|-|*|\/]*$/)]]
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
    //remove errors
    this.editItemForm.controls.height.setErrors(null)
    this.editItemForm.controls.length.setErrors(null)
    this.editItemForm.controls.width.setErrors(null)

    this.editItem = { ...this.editItem, ...this.editItemForm.value }
    this.editItem.units = this.units
    this.loading = true;
    this.itemsService.putItem(this.editItem).subscribe(editItem => this.editItemRef.close({ deletedItem: null, editedItem: editItem }))
  }

  close() {
    this.editItemRef.close({ deletedItem: null, editedItem: null });
  }

  delete() {
    this.submitted = true;
    this.loading = true;
    this.itemsService.deleteItem(this.editItem).subscribe(() => this.editItemRef.close({ deletedItem: this.editItem, editedItem: null }))
  }

}

