import { Component, OnInit, ViewChild } from '@angular/core';
import { ContainersService } from 'src/app/_services/containers.service';
import { Container } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-containers-selection',
  templateUrl: './containers-selection.component.html',
  styleUrls: ['./containers-selection.component.scss']
})
export class ContainersSelectionComponent implements OnInit {

  containers: Container[];
  dataSource;
  displayedColumns: string[] = ['select', 'width', 'length', 'height'];

  selection = new SelectionModel<Container>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private containersservice: ContainersService) { }

  ngOnInit(): void {
    this.containersservice.getAll().subscribe(containers => { this.containers = containers; this.dataSource = new MatTableDataSource(containers); console.log(containers); this.dataSource.sort = this.sort; })
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



