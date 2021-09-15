import { Component, OnInit, ViewChild } from '@angular/core';
import { ContainersService } from 'src/app/_services/containers.service';
import { Container } from 'src/app/_models/container';
import { MatDialog } from '@angular/material/dialog';
import { NewContainerComponent } from 'src/app/_components/new-container/new-container.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EditContainerComponent } from 'src/app/_components/edit-container/edit-container.component';
import { AuthenticationService } from 'src/app/_services';
import { UnitsPipe, VolumeUnitsPipe } from 'src/app/_helpers';
import { DecimalPipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  loading: boolean = true;
  containers$: Observable<Container[]>;
  containers: Container[];
  CONTAINERS_CACHE_KEY: string;
  dataSource;
  displayedColumns: string[] = ['sku', 'description', 'yDim', 'zDim', 'xDim', 'volume'];
  currentUser = this.authenticationService.currentUserValue;
  newOrEditedContainer: Container;
  userHasContainers: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private containersservice: ContainersService, public newContainerDialog: MatDialog, private authenticationService: AuthenticationService, private unitsPipe: UnitsPipe, private volumeUnitsPipe: VolumeUnitsPipe, private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => {
      this.currentUser = currentUser; this.CONTAINERS_CACHE_KEY = `containers-${this.currentUser.id}`
    })

    this.containers$ = this.containersservice.getAll().pipe(map(shipments => shipments))
    this.CONTAINERS_CACHE_KEY = `containers-${this.currentUser.id}`
    this.containers$ = this.containers$.pipe(startWith(JSON.parse(localStorage[this.CONTAINERS_CACHE_KEY] || '[]')))

    this.containers$.subscribe(containers => {
      this.loading = false; this.containers = containers;
      this.dataSource = new MatTableDataSource(containers);
      this.dataSource.sort = this.sort;
      this.doesUserHaveContainers()
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'xDim': return this.unitsPipe.transform(item.xDim, item.units, this.currentUser.units);
          case 'yDim': return this.unitsPipe.transform(item.yDim, item.units, this.currentUser.units);
          case 'zDim': return this.unitsPipe.transform(item.zDim, item.units, this.currentUser.units);
          case 'volume': return this.volumeUnitsPipe.transform(item.volume, item.units, this.currentUser.units);
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
        this.decimalPipe.transform(this.unitsPipe.transform(data.xDim, data.units, this.currentUser.units), '1.0-3').toString().includes(filter) ||
        this.decimalPipe.transform(this.unitsPipe.transform(data.yDim, data.units, this.currentUser.units), '1.0-3').toString().includes(filter) ||
        this.decimalPipe.transform(this.unitsPipe.transform(data.zDim, data.units, this.currentUser.units), '1.0-3').toString().includes(filter) ||
        this.decimalPipe.transform(this.volumeUnitsPipe.transform(data.volume, data.units, this.currentUser.units), '1.1-1').toString().includes(filter)
    })

    this.containers$.subscribe(containers => {
      this.updateCache(containers.sort((a, b) => a.id - b.id).slice(-200))
    })
  }

  updateCache(containers) {
    localStorage[this.CONTAINERS_CACHE_KEY] = JSON.stringify(containers)
  }

  doesUserHaveContainers() {
    this.dataSource.data.length == 0 ? this.userHasContainers = false : this.userHasContainers = true
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
        this.newOrEditedContainer = newContainer;
        this.doesUserHaveContainers()
        this.updateCache(this.dataSource.data)
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
      if (data) {
        if (data.editedContainer) {
          const editedContainer = data.editedContainer;
          this.dataSource.data = this.dataSource.data.filter(container => container.id !== editedContainer.id);
          this.dataSource.data.unshift(editedContainer);
          this.dataSource._updateChangeSubscription();
          this.newOrEditedContainer = editedContainer;
          this.doesUserHaveContainers()
          this.updateCache(this.dataSource.data)
        }

        if (data.deletedContainer) {
          const deletedContainer = data.deletedContainer
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== deletedContainer.id);
          this.dataSource._updateChangeSubscription();
          this.doesUserHaveContainers()
          this.updateCache(this.dataSource.data)
        }
      }
    });
  }
}