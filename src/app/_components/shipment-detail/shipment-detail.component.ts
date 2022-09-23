import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Shipment } from 'src/app/_models/shipment';
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

@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ShipmentDetailComponent implements OnInit {
  currentUser = this.authenticationService.currentUserValue;
  shipment: Shipment;
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

  shipmentId: number;
  submitted = false;
  loading = true;
  @ViewChildren('nonEmptyContainersTableSort') nonEmptyContainersTableSorts: QueryList<MatSort>;
  @ViewChildren('itemsTableSort') itemsTableSorts: QueryList<MatSort>;
  @ViewChildren('containersTableSort') containersTableSorts: QueryList<MatSort>;

  constructor(private route: ActivatedRoute, private shipmentsService: ShipmentsService, private router: Router, private authenticationService: AuthenticationService, public shipmentAlert: MatDialog, public confirmDeleteShipmentDialog: MatDialog) { }

  ngOnInit() {

    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)

    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      this.shipmentsService.getSimpleShipmentById(this.shipmentId).subscribe(shipment => {
        this.shipment = shipment;
        this.timeout = shipment.timeout;
        this.containers = shipment.containers;
        this.items = shipment.items;
        this.multiBinPack = shipment.multiBinPack
        this.arrangementPossible = shipment.arrangementPossible
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

        // this.groupedItemsByMasterIdAndContainer = [...this.shipment.items.reduce((r, o) => {
        //   const key = o.masterItemId + '-' + o.container;
        //   const item = r.get(key) || Object.assign({}, o, {
        //     qty: 0,
        //   });
        //   item.qty += 1;
        //   return r.set(key, item);
        // }, new Map).values()];


        this.groupedItemsByMasterId = [...this.shipment.items.reduce((r, o) => {
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
          this.openshipmentAlertDialog();
        }
      })
    })
  }


  openshipmentAlertDialog(): void {
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
      data: { type: 'shipment' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.delete) {
          this.shipmentsService.deleteArrangement(this.shipment).subscribe(() => this.router.navigate(['./', { outlets: { view: ['shipments'] } }], { replaceUrl: true }))
        }
      }
    })
  }

  delete() {
    this.submitted = true;
    this.openConfirmDeleteDialog()
  }
}