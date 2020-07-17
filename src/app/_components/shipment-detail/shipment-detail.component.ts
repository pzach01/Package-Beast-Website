import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { Shipment } from 'src/app/_models/shipment';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ShipmentDetailComponent implements OnInit, AfterViewInit {
  currentUser = this.authenticationService.currentUserValue;
  shipment: Shipment;
  items: Item[];
  groupedItemsByMasterIdAndContainer: Item[] = [];
  containers: Container[] = [];
  nonEmptyContainers: Container[] = [];

  multiBinPack: boolean;
  itemsDataSource = new MatTableDataSource(this.items);
  containersDataSource = new MatTableDataSource(this.containers);
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description', 'xDim', 'yDim', 'zDim', 'volume'];

  shipmentId: number;
  submitted = false;
  loading = false;

  constructor(private route: ActivatedRoute, private shipmentsService: ShipmentsService, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)

    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      console.log("shipmentId", this.shipmentId)
      this.shipmentsService.getShipmentById(this.shipmentId).subscribe(shipment => {
        this.shipment = shipment;
        this.containers = shipment.containers;
        this.items = shipment.items;
        this.multiBinPack = shipment.multiBinPack

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

        //Many items. The code below groups the items by masterItemId and assigns a qty to the items
        //so we can show qty in the table

        this.groupedItemsByMasterIdAndContainer = [...this.shipment.items.reduce((r, o) => {
          const key = o.masterItemId + '-' + o.container;

          const item = r.get(key) || Object.assign({}, o, {
            qty: 0,
          });

          item.qty += 1;

          return r.set(key, item);
        }, new Map).values()];

        console.log("result", this.groupedItemsByMasterIdAndContainer);
        console.log("containerLength", this.containers.length)
        this.itemsDataSource.data = this.groupedItemsByMasterIdAndContainer;
        this.containersDataSource.data = this.containers;
      })
    })
  }
  ngAfterViewInit() { }

  delete() {
    this.submitted = true;
    this.loading = true;
    this.shipmentsService.deleteArrangement(this.shipment).subscribe(() => this.router.navigate(['./', { outlets: { view: ['shipments'] } }], { replaceUrl: true })
    )
  }
}