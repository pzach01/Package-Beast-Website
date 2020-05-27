import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { ItemsSelectionComponent } from '../items-selection/items-selection.component';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { ContainersSelectionComponent } from 'src/app/_components/containers-selection/containers-selection.component';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { ReviewShipmentComponent } from '../review-shipment/review-shipment.component';

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

  constructor(private shipmentsService: ShipmentsService) { }

  ngOnInit() { }

  selectionChange() {
    this.selectedItems = this.itemsSelectionComponent.selection.selected;
    this.selectedContainers = this.containersSelectionComponent.selection.selected;
    this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
  }
  analyze() {
    let shipment = new Shipment();
    shipment.containers = this.selectedContainers;
    shipment.items = this.selectedItems;
    this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
    shipment.multiBinPack = this.multiBinPack;
    this.shipmentsService.postArrangement(shipment).subscribe(shipment => {
      console.log(shipment)
    })
  }
}
