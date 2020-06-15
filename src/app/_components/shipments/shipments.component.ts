import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { MatDialog } from '@angular/material/dialog';
import { NewShipmentComponent } from 'src/app/_components/new-shipment/new-shipment.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  shipments: Shipment[];
  dataSource;
  displayedColumns: string[] = ['created'];
  dateFormat: string = 'MMM d, yyyy, h:mm aa';

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private shipmentsservice: ShipmentsService, public newShipmentDialog: MatDialog, private datePipe: DatePipe, private router: Router) { }

  transformDate(date) {
    console.log("date:", this.datePipe.transform(date, this.dateFormat).trim().toLowerCase());
    return this.datePipe.transform(date, this.dateFormat).trim().toLowerCase();
  }
  ngOnInit(): void {
    this.shipmentsservice.getAll().subscribe(shipments => {
      this.shipments = shipments; this.dataSource = new MatTableDataSource(shipments); console.log(shipments); this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate =
        (data: any, filter: string) => !filter || this.transformDate(data.created).includes(filter)
    })
  }

  openDialog(): void {
    const dialogRef = this.newShipmentDialog.open(NewShipmentComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe(newShipment => {
      if (newShipment) {
        this.router.navigate(['./', { outlets: { view: ['shipments', newShipment.id] } }]);
        console.log("new shipment", newShipment);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openShipmentDetail(shipment: Shipment) {
    this.router.navigate(['./', { outlets: { view: ['shipments', shipment.id] } }]);
  }
}
