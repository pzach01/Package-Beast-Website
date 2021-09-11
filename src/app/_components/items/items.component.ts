import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from 'src/app/_services/items.service';
import { Item } from 'src/app/_models/item';
import { EditItemComponent } from 'src/app/_components/edit-item/edit-item.component'
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from 'src/app/_components/new-item/new-item.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from 'src/app/_services';
import { UnitsPipe } from 'src/app/_helpers';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  loading: boolean = true;
  items$: Observable<Item[]>;
  ITEMS_CACHE_KEY: string;
  items: Item[];
  dataSource;
  displayedColumns: string[] = ['sku', 'description', 'length', 'width', 'height'];
  currentUser = this.authenticationService.currentUserValue;
  newOrEditedItem: Item;
  userHasItems: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table;

  constructor(private itemsService: ItemsService, public newItemDialog: MatDialog, private authenticationService: AuthenticationService, private unitsPipe: UnitsPipe, private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => { this.currentUser = currentUser; this.ITEMS_CACHE_KEY = `items-${this.currentUser.id}` })

    this.items$ = this.itemsService.getAll().pipe(map(shipments => shipments))
    this.ITEMS_CACHE_KEY = `items-${this.currentUser.id}`
    this.items$ = this.items$.pipe(startWith(JSON.parse(localStorage[this.ITEMS_CACHE_KEY] || '[]')))

    this.items$.subscribe(items => {
      this.loading = false;
      this.items = items;
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.sort = this.sort;
      this.doesUserHaveItems()

      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'length': return this.unitsPipe.transform(item.length, item.units, this.currentUser.units);
          case 'width': return this.unitsPipe.transform(item.width, item.units, this.currentUser.units);
          case 'height': return this.unitsPipe.transform(item.height, item.units, this.currentUser.units);
          default: {
            return item[property];
          }
        }
      }
      this.sort.disableClear = true;
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        !filter ||
        data.sku.toString().toLowerCase().includes(filter) ||
        data.description.toString().toLowerCase().includes(filter) ||
        this.decimalPipe.transform(this.unitsPipe.transform(data.length, data.units, this.currentUser.units), '1.0-3').toString().includes(filter) ||
        this.decimalPipe.transform(this.unitsPipe.transform(data.width, data.units, this.currentUser.units), '1.0-3').toString().includes(filter) ||
        this.decimalPipe.transform(this.unitsPipe.transform(data.height, data.units, this.currentUser.units), '1.0-3').toString().includes(filter)
    })

    this.items$.subscribe(items => {
      this.updateCache(items)
    })
  }

  updateCache(items) {
    localStorage[this.ITEMS_CACHE_KEY] = JSON.stringify(items)
  }

  doesUserHaveItems() {
    this.dataSource.data.length == 0 ? this.userHasItems = false : this.userHasItems = true
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
        this.doesUserHaveItems()
        this.updateCache(this.dataSource.data)
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
          this.dataSource.sort = this.sort
          this.doesUserHaveItems()
          this.updateCache(this.dataSource.data)
        }
        if (data.deletedItem) {
          const deletedItem = data.deletedItem
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== deletedItem.id);
          this.dataSource._updateChangeSubscription();
          this.doesUserHaveItems()
          this.updateCache(this.dataSource.data)
        }
      }
    });
  }
}
