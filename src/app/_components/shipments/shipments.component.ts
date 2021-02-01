import { Component, OnInit, ViewChild } from '@angular/core';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { MatDialog } from '@angular/material/dialog';
import { NewShipmentComponent } from 'src/app/_components/new-shipment/new-shipment.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';

import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  loading: boolean = true;

  shipments: Shipment[];
  dataSource;
  displayedColumns: string[] = ['created'];
  currentUser = this.authenticationService.currentUserValue;
  dateTimeFormat = this.currentUser.dateTimeFormat
  userHasShipments: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private shipmentsservice: ShipmentsService, public newShipmentDialog: MatDialog, private datePipe: DatePipe, private router: Router, private authenticationService: AuthenticationService) { }

  transformDate(date) {
    return this.datePipe.transform(date, this.dateTimeFormat).trim().toLowerCase();
  }
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.shipmentsservice.getAll().subscribe(shipments => {
      this.loading = false;
      this.shipments = shipments; this.dataSource = new MatTableDataSource(shipments); this.dataSource.sort = this.sort;
      this.sort.disableClear = true;
      this.doesUserHaveShipments()
      this.dataSource.filterPredicate =
        (data: any, filter: string) => !filter || this.transformDate(data.created).includes(filter)
    })
  }
  // ngAfterViewChecked(): void {
  //   document.querySelector('mat-sidenav-content').scrollTop = 100;
  // }


  openDialog(): void {
    const dialogRef = this.newShipmentDialog.open(NewShipmentComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      height: '90vh',
    });

    dialogRef.afterClosed().subscribe(newShipment => {
      if (newShipment) {
        this.router.navigate(['./', { outlets: { view: ['shipments', newShipment.id] } }]);
      }
      this.doesUserHaveShipments();
    });
  }

  doesUserHaveShipments() {
    this.dataSource.data.length == 0 ? this.userHasShipments = false : this.userHasShipments = true
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openShipmentDetail(shipment: Shipment) {
    this.router.navigate(['./', { outlets: { view: ['shipments', shipment.id] } }]);
  }
}
