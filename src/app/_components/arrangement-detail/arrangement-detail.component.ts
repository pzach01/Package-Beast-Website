import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Arrangement } from 'src/app/_models/arrangement'
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/_services';
import { ShipmentAlertComponent } from '../shipment-alert/shipment-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfirmDeleteDialogComponent } from 'src/app/_components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ShippoAuthenticationService } from 'src/app/_services/shippo-authentication.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-arrangement-detail',
  templateUrl: './arrangement-detail.component.html',
  styleUrls: ['./arrangement-detail.component.scss']
})
export class ArrangementDetailComponent implements OnInit {

  currentUser = this.authenticationService.currentUserValue;
  arrangement: Arrangement;
  timeout: boolean = false;
  items: Item[];
  nonEmptyContainersDataSource: MatTableDataSource<any>;
  itemsDataSource: MatTableDataSource<any>;
  containersDataSource: MatTableDataSource<any>;
  groupedItemsByMasterId: Item[] = [];
  numberFitItems: number = 0;
  containers: Container[] = [];
  nonEmptyContainers: Container[] = [];

  multiBinPack: boolean;
  arrangementPossible: boolean;
  nonEmptyContainersDisplayedColumns: string[] = ['sku', 'description', 'yDim', 'zDim', 'xDim', 'volume'];
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description', 'yDim', 'zDim', 'xDim', 'volume'];

  arrangementId: number;
  submitted = false;
  loading = true;
  @ViewChildren('nonEmptyContainersTableSort') nonEmptyContainersTableSorts: QueryList<MatSort>;
  @ViewChildren('itemsTableSort') itemsTableSorts: QueryList<MatSort>;
  @ViewChildren('containersTableSort') containersTableSorts: QueryList<MatSort>;

  constructor(private shipoAuthenticationService: ShippoAuthenticationService, private route: ActivatedRoute, private shipmentsService: ShipmentsService, private router: Router, private authenticationService: AuthenticationService, public shipmentAlert: MatDialog, public confirmDeleteShipmentDialog: MatDialog) { }

  ngOnInit() {

    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    const quoteId = +this.route.snapshot.params['quoteId']; // (+) converts string 'id' to a number

    console.log(this.route.snapshot.params['quoteId'])

    this.shipmentsService.getQuoteById(quoteId).subscribe(quote => {
      const arrangement = quote.arrangement
      this.arrangement = arrangement;
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

      this.containersDataSource = new MatTableDataSource(this.containers);
      this.containersTableSorts.changes.subscribe(() => {
        this.containersDataSource.sort = this.containersTableSorts.first
      })

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
    const state = this.shipoAuthenticationService.createShippoRandomString(40)
    const shippoLoginUrl = `https://goshippo.com/oauth/authorize?response_type=code&client_id=${environment.SHIPPO_CLIENT_ID}&scope=*&state=${state}`;
    console.log("navigate to shippo login")
    window.location.href = shippoLoginUrl
  }
}
