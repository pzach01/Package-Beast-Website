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
  itemsDataSource: MatTableDataSource<any>;
  containersDataSource: MatTableDataSource<any>;
  groupedItemsByMasterIdAndContainer: Item[] = [];
  numberFitItems: number = 0;
  containers: Container[] = [];
  nonEmptyContainers: Container[] = [];

  multiBinPack: boolean;
  arrangementPossible: boolean;
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description', 'xDim', 'yDim', 'zDim', 'volume'];

  shipmentId: number;
  submitted = false;
  loading = false;
  @ViewChildren('itemsTableSort') itemsTableSorts: QueryList<MatSort>;
  @ViewChildren('containersTableSort') containersTableSorts: QueryList<MatSort>;

  constructor(private route: ActivatedRoute, private shipmentsService: ShipmentsService, private router: Router, private authenticationService: AuthenticationService, public shipmentAlert: MatDialog, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)

    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      this.shipmentsService.getShipmentById(this.shipmentId).subscribe(shipment => {
        this.shipment = shipment;
        this.timeout = shipment.timeout;
        this.containers = shipment.containers;
        this.items = shipment.items;
        this.multiBinPack = shipment.multiBinPack
        this.arrangementPossible = shipment.arrangementPossible

        //the code below filters out empty containers so we don't render them
        this.nonEmptyContainers = this.containers.filter((container) => {
          let containerContainsItem = false;
          this.items.forEach(item => {
            if (item.container == container.id) {
              containerContainsItem = true
            }
            if (item.container != null) {
              this.numberFitItems += 1
              console.log(this.numberFitItems)
            }
          })
          return containerContainsItem
        });


        //The code below groups the items by masterItemId and assigns a qty to the items
        //so we can show qty in the table

        this.groupedItemsByMasterIdAndContainer = [...this.shipment.items.reduce((r, o) => {
          const key = o.masterItemId + '-' + o.container;
          const item = r.get(key) || Object.assign({}, o, {
            qty: 0,
          });
          item.qty += 1;
          return r.set(key, item);
        }, new Map).values()];



        this.itemsDataSource = new MatTableDataSource(this.groupedItemsByMasterIdAndContainer);
        this.itemsTableSorts.changes.subscribe(() => {
          // Now you can access to the child component
          console.log(this.itemsTableSorts.first)
          this.itemsDataSource.sort = this.itemsTableSorts.first;
        });

        this.containersDataSource = new MatTableDataSource(this.containers);
        this.containersTableSorts.changes.subscribe(() => {
          this.containersDataSource.sort = this.containersTableSorts.first
        })

        this.openshipmentAlertDialog();
      })
    })
  }


  openshipmentAlertDialog(): void {
    this.shipmentAlert.open(ShipmentAlertComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { numberFitItems: 1234, numberTotalItems: this.items.length }
    });
  }

  delete() {
    this.submitted = true;
    this.loading = true;
    this.shipmentsService.deleteArrangement(this.shipment).subscribe(() => this.router.navigate(['./', { outlets: { view: ['shipments'] } }], { replaceUrl: true })
    )
  }
}