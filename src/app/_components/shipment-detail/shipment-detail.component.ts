import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { Shipment } from 'src/app/_models/shipment';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';

@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ShipmentDetailComponent implements OnInit, AfterViewInit {
  shipment: Shipment;
  items: Item[];
  containers: Container[];

  scene = null;
  camera = null;
  mesh = null;
  controls = null;
  shipmentId: number;
  submitted = false;
  loading = false;

  constructor(private route: ActivatedRoute, private shipmentsService: ShipmentsService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      console.log("shipmentId", this.shipmentId)
      this.shipmentsService.getShipmentById(this.shipmentId).subscribe(shipment => {
        this.shipment = shipment;
        this.containers = shipment.containers;
        this.items = shipment.items;

        //the code below filters out empty containers so we don't render them
        this.containers = this.containers.filter((container) => {
          let containerContainersItem = false;
          this.items.forEach(item => {
            if (item.container == container.id) {
              containerContainersItem = true
            }
          })
          return containerContainersItem
        });
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