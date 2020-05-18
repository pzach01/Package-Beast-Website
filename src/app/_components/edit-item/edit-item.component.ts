import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  editItemForm: FormGroup;
  submitted = false;
  loading = false;
  units = 'Inches';

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
      width: [this.editItem.width, [Validators.required]],
      length: [this.editItem.length, [Validators.required]],
      height: [this.editItem.height, [Validators.required]]
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editItemForm.invalid) {
      return;
    }

    this.editItem = { ...this.editItem, ...this.editItemForm.value }

    this.loading = true;
    this.itemsService.putItem(this.editItem).subscribe(editItem => this.editItemRef.close(editItem))
  }

  close() {
    this.editItemRef.close();
  }

}

