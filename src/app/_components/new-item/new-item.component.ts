import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/_models/item';


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {

  constructor(
    public newItemRef: MatDialogRef<NewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item) { }

  onNoClick(): void {
    this.newItemRef.close();
  }

  ngOnInit(): void {
  }

}
