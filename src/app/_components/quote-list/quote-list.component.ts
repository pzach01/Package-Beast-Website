import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quote } from 'src/app/_models/quote';
import { Shipment } from 'src/app/_models/shipment';
import { faUps, faUsps } from '@fortawesome/free-brands-svg-icons'
import { faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from 'src/app/_components/confirm-delete-dialog/confirm-delete-dialog.component';


@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  faUps = faUps;
  faUsps = faUsps;
  faArrowLeft = faArrowLeft;
  faCheckCircle = faCheckCircle;
  displayedColumns: string[] = ["selectedIcon", "carrier", "cost", "daysToShip", "serviceDescription", "containerSku", "containerDescription"];
  dataSource;
  shipment: Shipment;
  loading: boolean = true;
  userHasQuotes = true
  labelPurchased: boolean = false;
  randomColor: string = 'blue';

  myStyles = {
    fontSize: '3em',
    backgroundColor: 'pink',
    color: 'maroon'
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private shipmentsService: ShipmentsService, private route: ActivatedRoute, private router: Router, public confirmDeleteItemDialog: MatDialog) { }

  ngOnInit(): void {

    // this.shipment = of(window.history.state.shipment);

    const shipmentId = +this.route.parent.snapshot.params['id'];

    // if (!window.history.state.quotes) {
    //   // No quotes. Better get a shipment from the backend
    //   const shipmentId = +this.route.parent.snapshot.params['id'];
    //   this.shipment = this.shipmentsService.getShipmentById(shipmentId)
    // }
    this.shipmentsService.getSimpleShipmentById(shipmentId).subscribe(shipment => {
      console.log(shipment)
      if (shipment) {
        this.shipment = shipment
        this.labelPurchased = Boolean(shipment.quotes.filter(quote => quote.shippoTransaction?.objectState == 'VALID').length);
        console.log('lp', this.labelPurchased)
        this.loading = false;
        this.dataSource = new MatTableDataSource(shipment.quotes);
        this.dataSource.sort = this.sort;
      }
    })
  }
  openQuoteDetail(quote: Quote) {

    this.shipmentsService.setLastSelectedQuote(this.shipment, quote).subscribe(() => {
      this.router.navigate(['./', { outlets: { view: ['shipments', +this.route.parent.snapshot.params['id'], 'quotes', quote.id] } }]);
    }), e => console.log(e)

  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.confirmDeleteItemDialog.open(ConfirmDeleteDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: 'shipment' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.delete) {
          this.shipmentsService.deleteShipment(this.shipment).subscribe(() =>
            this.router.navigate(['./', { outlets: { view: ['shipments'] } }])
          )
        }
      }
    })
  }

  backToShipments() {
    this.router.navigate(['./', { outlets: { view: ['shipments'] } }])
  }

  delete() {
    console.log('Delete delete')
    this.openConfirmDeleteDialog()
  }
}
