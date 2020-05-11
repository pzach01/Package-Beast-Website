import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';


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
      width: ['', [Validators.required]],
      length: ['', [Validators.required]],
      height: ['', [Validators.required]]
    });
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newItemForm.invalid) {
      return;
    }

    this.newItem = new Item(this.newItemForm.get('width').value, this.newItemForm.get('length').value, this.newItemForm.get('height').value, 0)
    this.loading = true;
    this.itemsService.postItem(this.newItem).subscribe(newItem => { console.log(newItem); this.newItemRef.close(newItem); })

  }

  close() {
    this.newItemRef.close();
  }

}
