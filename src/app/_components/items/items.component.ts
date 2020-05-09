import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/_services/items.service';
import { Item } from 'src/app/_models/item';
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from 'src/app/_components/new-item/new-item.component';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[];
  constructor(private itemsservice: ItemsService, public newItemDialog: MatDialog) { }

  ngOnInit(): void {
    this.itemsservice.getAll().subscribe(items => { this.items = items; console.log(items) })
  }


  openDialog(): void {
    const dialogRef = this.newItemDialog.open(NewItemComponent, {
      width: '70%',
      data: { name: "hello", animal: "world" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
}
