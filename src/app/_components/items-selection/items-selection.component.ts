import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from 'src/app/_services/items.service';
import { Item } from 'src/app/_models/item';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-items-selection',
  templateUrl: './items-selection.component.html',
  styleUrls: ['./items-selection.component.scss']
})
export class ItemsSelectionComponent implements OnInit {

  items: Item[];
  dataSource;
  displayedColumns: string[] = ['select', 'width', 'height', 'length'];

  selection = new SelectionModel<Item>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private itemsservice: ItemsService) { }

  ngOnInit(): void {
    this.itemsservice.getAll().subscribe(items => { this.items = items; this.dataSource = new MatTableDataSource(items); console.log(items); this.dataSource.sort = this.sort; })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}



