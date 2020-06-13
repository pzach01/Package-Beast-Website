import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsSelectionComponent } from '../items-selection/items-selection.component';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { ContainersSelectionComponent } from 'src/app/_components/containers-selection/containers-selection.component';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { ReviewShipmentComponent } from '../review-shipment/review-shipment.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-shipment',
  templateUrl: './new-shipment.component.html',
  styleUrls: ['./new-shipment.component.scss']
})
export class NewShipmentComponent implements OnInit {

  @ViewChild(ItemsSelectionComponent) itemsSelectionComponent: ItemsSelectionComponent;
  @ViewChild(ContainersSelectionComponent) containersSelectionComponent: ContainersSelectionComponent;
  @ViewChild(ReviewShipmentComponent) reviewShipmentComponent: ReviewShipmentComponent;

  selectedItems: Item[];
  selectedContainers: Container[];
  multiBinPack: boolean;
  shipment: Shipment = new Shipment();

  constructor(private shipmentsService: ShipmentsService, public newShipmentRef: MatDialogRef<NewShipmentComponent>,
  ) { }

  ngOnInit() { }

  selectionChange() {
    this.selectedItems = this.itemsSelectionComponent.selection.selected;
    this.selectedContainers = this.containersSelectionComponent.selection.selected;
    this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
  }
  analyze() {
    this.shipment.containers = this.selectedContainers;

    let shipmentItems: Item[] = []
    this.selectedItems.forEach(selectedItem => {
      console.log("qty", selectedItem.qty)
      for (let index = 0; index < selectedItem.qty; index++) {
        shipmentItems.push(selectedItem)
      }
    });
    this.shipment.items = shipmentItems;

    this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
    this.shipment.multiBinPack = this.multiBinPack;
    this.shipmentsService.postArrangement(this.shipment).subscribe(shipment => {
      console.log(shipment)
      this.newShipmentRef.close(shipment)
    })
  }
}
