import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';
import { evaluate } from 'mathjs'


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {
  newItemForm: FormGroup;
  submitted = false;
  loading = false;
  units = 'Inches';

  constructor(
    private formBuilder: FormBuilder,
    public newItemRef: MatDialogRef<NewItemComponent>,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public newItem: Item) { }

  onNoClick(): void {
    this.newItemRef.close();
  }

  ngOnInit(): void {
    this.newItemForm = this.formBuilder.group({
      sku: ['', []],
      description: ['', [Validators.required]],
      width: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]],
      length: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]],
      height: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]]
    });
  }

  save() {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.newItemForm.invalid) {
      return;
    }

    //evaluate expression
    this.newItemForm.controls.width.setValue(evaluate(this.newItemForm.controls.width.value))
    this.newItemForm.controls.length.setValue(evaluate(this.newItemForm.controls.length.value))
    this.newItemForm.controls.height.setValue(evaluate(this.newItemForm.controls.height.value))
    //remove errors
    this.newItemForm.controls.width.setErrors(null)
    this.newItemForm.controls.length.setErrors(null)
    this.newItemForm.controls.height.setErrors(null)

    this.newItem = new Item(this.newItemForm.value)
    this.itemsService.postItem(this.newItem).subscribe(newItem => {
      console.log(newItem);
      this.newItemRef.close(newItem);
    })
  }

  close() {
    this.newItemRef.close();
  }

}
