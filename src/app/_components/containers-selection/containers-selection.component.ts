import { Component, OnInit, ViewChild } from '@angular/core';
import { ContainersService } from 'src/app/_services/containers.service';
import { Container, ThirdPartyContainer } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationService } from 'src/app/_services';
import { UnitsPipe, VolumeUnitsPipe } from 'src/app/_helpers';
import { DecimalPipe } from '@angular/common';
import { faUps, faUsps } from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-containers-selection',
  templateUrl: './containers-selection.component.html',
  styleUrls: ['./containers-selection.component.scss']
})
export class ContainersSelectionComponent implements OnInit {
  faUps = faUps
  faUsps = faUsps
  currentUser = this.authenticationService.currentUserValue;
  containers: Container[];
  thirdPartyContainers: ThirdPartyContainer[];
  includeUpsContainers: boolean = this.currentUser.includeUpsContainers;
  includeUspsContainers: boolean = this.currentUser.includeUspsContainers;
  dataSource;
  displayedColumns: string[] = ['select', 'sku', 'description', 'xDim', 'zDim', 'yDim', 'volume'];
  selection = new SelectionModel<Container>(true, []);
  userHasContainers: boolean = true;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private containersservice: ContainersService, private authenticationService: AuthenticationService, private unitsPipe: UnitsPipe, private volumeUnitsPipe: VolumeUnitsPipe, private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => { this.currentUser = currentUser; this.includeUpsContainers = currentUser.includeUpsContainers; this.includeUspsContainers = currentUser.includeUspsContainers })
    this.containersservice.getAll().subscribe(containers => {
      if (containers.length == 0) {
        this.userHasContainers = false
      }
      this.containers = containers;
      this.dataSource = new MatTableDataSource(containers);
      this.dataSource.sort = this.sort;
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

      this.masterToggle()
    })
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

  toggle(toggledRow) {
    this.selection.toggle(toggledRow)
  }

  toggleUpsContainers() {
    this.includeUpsContainers = !this.includeUpsContainers
    const UPSContainers = this.thirdPartyContainers.filter(thirdPartyContainer => thirdPartyContainer.supplier == 'UPS')
    if (this.includeUpsContainers) {
      this.dataSource.data = this.dataSource.data.concat(UPSContainers)
    } else {
      this.dataSource.data = this.dataSource.data.filter(ar => !UPSContainers.find(rm => (rm.id === ar.id)))
    }
  }
  toggleUspsContainers() {
    this.includeUspsContainers = !this.includeUspsContainers
    const USPSContainers = this.thirdPartyContainers.filter(thirdPartyContainer => thirdPartyContainer.supplier == 'USPS')
    if (this.includeUspsContainers) {
      this.dataSource.data = this.dataSource.data.concat(USPSContainers)
    } else {
      this.dataSource.data = this.dataSource.data.filter(ar => !USPSContainers.find(rm => (rm.id === ar.id)))
    }

  }
}



