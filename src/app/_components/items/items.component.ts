import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from 'src/app/_services/items.service';
import { Item } from 'src/app/_models/item';
import { EditItemComponent } from 'src/app/_components/edit-item/edit-item.component'
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from 'src/app/_components/new-item/new-item.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  loading: boolean = true;
  items: Item[];
  dataSource;
  displayedColumns: string[] = ['sku', 'description', 'length', 'width', 'height'];
  currentUser = this.authenticationService.currentUserValue;
  newOrEditedItem: Item;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table;

  constructor(private itemsService: ItemsService, public newItemDialog: MatDialog, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)

    this.itemsService.getAll().subscribe(items => {
      this.loading = false;
      this.items = items;
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        !filter ||
        data.sku.toString().toLowerCase().includes(filter) ||
        data.description.toString().toLowerCase().includes(filter) ||
        data.length.toString().includes(filter) ||
        data.width.toString().includes(filter) ||
        data.height.toString().includes(filter)
    })
  }

  openDialog(): void {
    const dialogRef = this.newItemDialog.open(NewItemComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(newItem => {
      if (newItem) {
        this.dataSource.data.unshift(newItem);
        this.dataSource._updateChangeSubscription();
        this.newOrEditedItem = newItem;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditItemDialog(item): void {
    const dialogRef = this.newItemDialog.open(EditItemComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: item,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.editedItem) {
          const editedItem = data.editedItem
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== editedItem.id);
          this.dataSource.data.unshift(editedItem);
          this.dataSource._updateChangeSubscription();
          this.newOrEditedItem = editedItem;

        }
        if (data.deletedItem) {
          const deletedItem = data.deletedItem
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== deletedItem.id);
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }
}
