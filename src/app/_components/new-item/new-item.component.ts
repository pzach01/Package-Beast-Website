import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/_services/items.service';
import { evaluate } from 'mathjs'
import { AuthenticationService } from 'src/app/_services';


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

  constructor(
    private formBuilder: FormBuilder,
    public newItemRef: MatDialogRef<NewItemComponent>,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public newItem: Item,
    private authenticationService: AuthenticationService) { }

  onNoClick(): void {
    this.newItemRef.close();
  }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.newItemForm = this.formBuilder.group({
      sku: ['', []],
      description: ['', [Validators.required]],
      xDim: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]],
      yDim: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]],
      zDim: ['', [Validators.required, Validators.pattern(/[0-9|.|+|-|/|*]/g)]]
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
    this.newItemForm.controls.xDim.setValue(evaluate(this.newItemForm.controls.xDim.value))
    this.newItemForm.controls.yDim.setValue(evaluate(this.newItemForm.controls.yDim.value))
    this.newItemForm.controls.zDim.setValue(evaluate(this.newItemForm.controls.zDim.value))
    //remove errors
    this.newItemForm.controls.xDim.setErrors(null)
    this.newItemForm.controls.yDim.setErrors(null)
    this.newItemForm.controls.zDim.setErrors(null)

    this.newItem = new Item(this.newItemForm.value)
    console.log(this.newItem)
    this.itemsService.postItem(this.newItem).subscribe(newItem => {
      console.log(newItem);
      this.newItemRef.close(newItem);
    })
  }

  close() {
    this.newItemRef.close();
  }

}
