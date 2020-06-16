import { Component, OnInit, ViewChild } from '@angular/core';
import { ContainersService } from 'src/app/_services/containers.service';
import { Container } from 'src/app/_models/container';
import { MatDialog } from '@angular/material/dialog';
import { NewContainerComponent } from 'src/app/_components/new-container/new-container.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EditContainerComponent } from 'src/app/_components/edit-container/edit-container.component';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  containers: Container[];
  dataSource;
  displayedColumns: string[] = ['sku', 'description', 'length', 'width', 'height', 'volume'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private containersservice: ContainersService, public newContainerDialog: MatDialog) { }

  ngOnInit(): void {
    this.containersservice.getAll().subscribe(containers => { this.containers = containers; this.dataSource = new MatTableDataSource(containers); console.log(containers); this.dataSource.sort = this.sort; })
  }

  openDialog(): void {
    const dialogRef = this.newContainerDialog.open(NewContainerComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(newContainer => {
      if (newContainer) {
        this.dataSource.data.unshift(newContainer);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditContainerDialog(item): void {
    const dialogRef = this.newContainerDialog.open(EditContainerComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: item
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.editedContainer) {
        const editedContainer = data.editedContainer;
        this.dataSource.data = this.dataSource.data.filter(container => container.id !== editedContainer.id);
        this.dataSource.data.unshift(editedContainer);
        this.dataSource._updateChangeSubscription();
      }

      if (data.deletedContainer) {
        const deletedContainer = data.deletedContainer
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== deletedContainer.id);
        this.dataSource._updateChangeSubscription();
      }
    });
  }
}