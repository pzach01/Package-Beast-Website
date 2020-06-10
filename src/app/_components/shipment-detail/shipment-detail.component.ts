import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as THREE from 'three';
import { Shipment } from 'src/app/_models/shipment';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  shipment: Shipment;
  items: Item[];
  containers: Container[];

  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = null;
  camera = null;
  mesh = null;
  controls = null;
  shipmentId: number;

  constructor(private route: ActivatedRoute, private shipmentsService: ShipmentsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      console.log("shipmentId", this.shipmentId)
      this.shipmentsService.getShipmentById(this.shipmentId).subscribe(shipment => {
        this.shipment = shipment;
        this.containers = shipment.containers;
        this.items = shipment.items;
        console.log("items from shipment detail", this.shipment.items)

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
}