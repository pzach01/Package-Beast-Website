import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Arrangement } from 'src/app/_models/arrangement'
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { ContainersService } from 'src/app/_services/containers.service';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/_services';
import { ShipmentAlertComponent } from '../shipment-alert/shipment-alert.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfirmDeleteDialogComponent } from 'src/app/_components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ShippoService } from 'src/app/_services/shippo.service';
import { environment } from 'src/environments/environment';
import { ShippoTransaction } from 'src/app/_models/shippo-transaction';
import { Quote } from 'src/app/_models/quote';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ConfirmLabelCreationDialogComponent } from 'src/app/confirm-label-creation-dialog/confirm-label-creation-dialog.component';
import { RefreshQuoteDialogComponent } from '../refresh-quote-dialog/refresh-quote-dialog.component';

@Component({
  selector: 'app-arrangement-detail',
  templateUrl: './arrangement-detail.component.html',
  styleUrls: ['./arrangement-detail.component.scss']
})
export class ArrangementDetailComponent implements OnInit {

  currentUser = this.authenticationService.currentUserValue;
  arrangement: Arrangement;
  quote: Quote;
  timeout: boolean = false;
  items: Item[];
  nonEmptyContainersDataSource: MatTableDataSource<any>;
  itemsDataSource: MatTableDataSource<any>;
  containersDataSource: MatTableDataSource<any>;
  groupedItemsByMasterId: Item[] = [];
  numberFitItems: number = 0;
  containers: Container[] = [];
  analyzedContainers: Container[] = [];
  nonEmptyContainers: Container[] = [];

  multiBinPack: boolean;
  arrangementPossible: boolean;
  nonEmptyContainersDisplayedColumns: string[] = ['sku', 'description', 'yDim', 'zDim', 'xDim', 'volume'];
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description', 'yDim', 'zDim', 'xDim', 'volume'];

  arrangementId: number;
  submitted = false;
  loading = true;
  loadingShippingLabel: boolean = false;
  labelHtml: SafeHtml

  @ViewChildren('nonEmptyContainersTableSort') nonEmptyContainersTableSorts: QueryList<MatSort>;
  @ViewChildren('itemsTableSort') itemsTableSorts: QueryList<MatSort>;
  @ViewChildren('containersTableSort') containersTableSorts: QueryList<MatSort>;

  constructor(private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private containersService: ContainersService, private shippoService: ShippoService, private route: ActivatedRoute, private shipmentsService: ShipmentsService, private router: Router, private authenticationService: AuthenticationService, public shipmentAlert: MatDialog, public confirmDeleteShipmentDialog: MatDialog, public confirmShippoLabelDialog: MatDialog, public refreshQuoteDialog: MatDialog) { }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(parentParam => {
      this.containersService.getAnalysedContainersFromShipmentId(parentParam.id).subscribe(analyzedContainers => {
        this.analyzedContainers = analyzedContainers;
        console.log('ac', this.analyzedContainers)
        this.containersDataSource = new MatTableDataSource(this.analyzedContainers);
        this.containersTableSorts.changes.subscribe(() => {
          this.containersDataSource.sort = this.containersTableSorts.first
        })
      })
    })
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    const quoteId = +this.route.snapshot.params['quoteId']; // (+) converts string 'id' to a number

    this.shipmentsService.getQuoteById(quoteId).subscribe(quote => {

      // this.containersService.getAnalysedContainersFromShipmentId(quote.shipment.id)
      // console.log("quote", quote)
      // console.log("quote.shipment.id", quote.shipment.id)

      const arrangement = quote.arrangement
      this.arrangement = arrangement;
      this.quote = quote;
      if (quote.shippoTransaction) { this.renderLabel() }

      console.log("arrangement", arrangement)
      this.timeout = arrangement.timeout;
      this.containers = arrangement.containers;
      this.items = arrangement.items;
      this.multiBinPack = arrangement.multiBinPack
      this.arrangementPossible = arrangement.arrangementPossible
      this.loading = false;

      //the code below filters out empty containers so we don't render them
      this.nonEmptyContainers = this.containers.filter((container) => {
        let containerContainsItem = false;
        this.items.forEach(item => {
          if (item.container == container.id) {
            containerContainsItem = true
          }
        })
        return containerContainsItem
      });

      //count the number of fit items
      this.items.forEach(item => {
        if (item.container != null) {
          this.numberFitItems += 1
        }
      })

      //Keeping this for now in case we want to use it for multibinpack???
      //The code below groups the items by masterItemId AND CONTAINER and assigns a qty to the items
      //so we can show qty in the table

      // this.groupedItemsByMasterIdAndContainer = [...this.arrangement.items.reduce((r, o) => {
      //   const key = o.masterItemId + '-' + o.container;
      //   const item = r.get(key) || Object.assign({}, o, {
      //     qty: 0,
      //   });
      //   item.qty += 1;
      //   return r.set(key, item);
      // }, new Map).values()];


      this.groupedItemsByMasterId = [...this.arrangement.items.reduce((r, o) => {
        const key = o.masterItemId;
        const item = r.get(key) || Object.assign({}, o, {
          qty: 0,
        });
        item.qty += 1;
        return r.set(key, item);
      }, new Map).values()];


      this.nonEmptyContainersDataSource = new MatTableDataSource(this.nonEmptyContainers);
      this.nonEmptyContainersTableSorts.changes.subscribe(() => {
        this.nonEmptyContainersDataSource.sort = this.nonEmptyContainersTableSorts.first
      })

      this.itemsDataSource = new MatTableDataSource(this.groupedItemsByMasterId);
      this.itemsTableSorts.changes.subscribe(() => {
        // Now you can access to the child component
        this.itemsDataSource.sort = this.itemsTableSorts.first;
      });



      // this.containersDataSource = new MatTableDataSource(this.containers);
      // this.containersTableSorts.changes.subscribe(() => {
      //   this.containersDataSource.sort = this.containersTableSorts.first
      // })

      if (this.numberFitItems != this.items.length) {
        this.openarrangementAlertDialog();
      }
    })
  }


  openarrangementAlertDialog(): void {
    this.shipmentAlert.open(ShipmentAlertComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { numberFitItems: this.numberFitItems, numberTotalItems: this.items.length }
    });
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.confirmDeleteShipmentDialog.open(ConfirmDeleteDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: 'arrangement' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.delete) {
          this.shipmentsService.deleteArrangement(this.arrangement).subscribe(() => this.router.navigate(['./', { outlets: { view: ['shipments'] } }], { replaceUrl: true }))
        }
      }
    })
  }

  delete() {
    this.submitted = true;
    this.openConfirmDeleteDialog()
  }

  shippoLogin() {
    const state = this.shippoService.createShippoRandomString(40)
    const shippoLoginUrl = `https://goshippo.com/oauth/authorize?response_type=code&client_id=${environment.SHIPPO_CLIENT_ID}&scope=*&state=${state}`;
    console.log("navigate to shippo login")
    window.location.href = shippoLoginUrl
  }

  createShippoTransaction() {
    this.shippoService.createTransaction(this.quote.shippoRateId, 'PDF').subscribe((transaction: ShippoTransaction) => {
      this.quote.shippoTransaction = transaction;
      this.renderLabel();
      this.loadingShippingLabel = false
      console.log(this.quote)
    }, e => {
      console.log('error', e)
    }
    )
  }

  openCreateShippoLabelTransactionCofirmDialog(): void {
    const dialogRef = this.confirmShippoLabelDialog.open(ConfirmLabelCreationDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { price: `$${this.quote.cost}` }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.purchase) {
          this.loadingShippingLabel = true;
          this.createShippoTransaction()
        }
      }
    })
  }

  openRefreshQuoteDialog() {
    const dialogRef = this.refreshQuoteDialog.open(RefreshQuoteDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.refresh) {
          this.refreshQuote()
        }
      }
    })
  }

  renderLabel() {
    // return `<div>${this.quote.shippoTransaction.label_url}</div>`;
    this.labelHtml = this.sanitizer.bypassSecurityTrustHtml(`<object data="${this.quote.shippoTransaction.label_url}" type="application/pdf" width="800px" height="600px"><a href="${this.quote.shippoTransaction.label_url}">Shipping Label</a></object>`);
  }

  goToLabelUrl() {
    window.location.href = this.quote.shippoTransaction.label_url
  }

  refundTransaction() {
    this.shippoService.refundTransaction(this.quote.shippoTransaction.id).subscribe((refund) => {
      this.quote.shippoTransaction.shippoRefund = refund
      console.log(this.quote)
      console.log('Transaction cancelled, yo!')
    }
    );
  }

  refreshQuote() {
    console.log('refresh')
    this.loadingShippingLabel = true;
    this.shippoService.refreshQuote(this.quote.id).subscribe((quote) => {
      this.quote = quote;
      this.loadingShippingLabel = false;
      console.log(quote);
    })
  }
}

