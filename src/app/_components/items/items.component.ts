import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/_services/items.service';
import { Item } from 'src/app/_models/item';
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from 'src/app/_components/new-item/new-item.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[];
  dataSource;
  displayedColumns: string[] = ['width', 'height', 'length'];

  constructor(private itemsservice: ItemsService, public newItemDialog: MatDialog) { }

  ngOnInit(): void {
    this.itemsservice.getAll().subscribe(items => { this.items = items; this.dataSource = new MatTableDataSource(items); console.log(items) })
  }


  openDialog(): void {
    const dialogRef = this.newItemDialog.open(NewItemComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(newItem => {
      if (newItem) {
        console.log("new item", newItem);
        this.items.unshift(newItem)
        this.dataSource = new MatTableDataSource(this.items);
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
