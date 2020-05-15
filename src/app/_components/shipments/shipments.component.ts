import { Component, OnInit, ViewChild } from '@angular/core';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { MatDialog } from '@angular/material/dialog';
import { NewShipmentComponent } from 'src/app/_components/new-shipment/new-shipment.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {
  shipments: Shipment[];
  dataSource;
  displayedColumns: string[] = ['id', 'owner', 'created'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private shipmentsservice: ShipmentsService, public newShipmentDialog: MatDialog) { }

  ngOnInit(): void {
    this.shipmentsservice.getAll().subscribe(shipments => { this.shipments = shipments; this.dataSource = new MatTableDataSource(shipments); console.log(shipments); this.dataSource.sort = this.sort; })
  }

  openDialog(): void {
    const dialogRef = this.newShipmentDialog.open(NewShipmentComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(newShipment => {
      if (newShipment) {
        console.log("new shipment", newShipment);
        this.shipments.unshift(newShipment)
        this.dataSource = new MatTableDataSource(this.shipments);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
