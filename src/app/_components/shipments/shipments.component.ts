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
import { map, skip, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  loading: boolean = true;

  shipments: Shipment[];
  shipments$: Observable<Shipment[]>
  SHIPMENTS_CACHE_KEY: string;
  dataSource;
  displayedColumns: string[] = ['title', 'created'];
  currentUser: User = this.authenticationService.currentUserValue;
  dateTimeFormat = this.currentUser.dateTimeFormat
  userHasShipments: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private shipmentsservice: ShipmentsService, public newShipmentDialog: MatDialog, private datePipe: DatePipe, private router: Router, private authenticationService: AuthenticationService) { }

  transformDate(date) {
    return this.datePipe.transform(date, this.dateTimeFormat).trim().toLowerCase();
  }
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => { this.currentUser = currentUser; this.SHIPMENTS_CACHE_KEY = `shipments${this.currentUser.id}` })
    this.shipments$ = this.shipmentsservice.getAll().pipe(map(shipments => shipments))
    this.SHIPMENTS_CACHE_KEY = `shipments-${this.currentUser.id}`
    this.shipments$ = this.shipments$.pipe(startWith(JSON.parse(localStorage[this.SHIPMENTS_CACHE_KEY] || '[]')))

    this.shipments$.subscribe(shipments => {
      console.log(shipments)

      this.shipments = shipments;
      this.dataSource = new MatTableDataSource(shipments);
      this.dataSource.sort = this.sort;
      this.sort.disableClear = true;
      this.doesUserHaveShipments()
      this.dataSource.filterPredicate =
        (data: any, filter: string) => !filter || data.title.toString().toLowerCase().includes(filter) ||
          this.transformDate(data.created).includes(filter)
    })

    this.shipments$.pipe(skip(1)).subscribe(shipments => {
      this.loading = false;
      this.updateCache(shipments)
    })

  }

  updateCache(shipments) {
    localStorage[this.SHIPMENTS_CACHE_KEY] = JSON.stringify(shipments.sort((a, b) => a.id - b.id).slice(-20))
  }
  // ngAfterViewChecked(): void {
  //   document.querySelector('mat-sidenav-content').scrollTop = 100;
  // }

  openDialog(): void {
    const dialogRef = this.newShipmentDialog.open(NewShipmentComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(newShipment => {
      if (newShipment) {
        this.router.navigate(['./', { outlets: { view: ['shipments', newShipment.id, 'quotes'] } }]);
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
    //this.router.navigate(['./', { outlets: { view: ['shipments', shipment.id] } }]);
    this.router.navigate(['./', { outlets: { view: ['shipments', shipment.id, 'quotes'] } }], { state: { shipment: shipment } });
  }
}
