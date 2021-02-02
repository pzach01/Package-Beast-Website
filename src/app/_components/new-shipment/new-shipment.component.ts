import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsSelectionComponent } from '../items-selection/items-selection.component';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { ContainersSelectionComponent } from 'src/app/_components/containers-selection/containers-selection.component';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { ReviewShipmentComponent } from '../review-shipment/review-shipment.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { timer } from 'rxjs/internal/observable/timer';
import { CreateFailDialogComponent } from '../create-fail-dialog/create-fail-dialog.component';

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
  multiBinPack: boolean = false;
  shipment: Shipment = new Shipment();
  loading = false;
  interval;
  spinnerValue = 0;
  timeoutDuration = 30;
  fastForwardtimeoutDuration = 2;
  dwellTime = 1000; //ms
  allowAnalysis: boolean = false;
  title: string = "My New Shipment";

  constructor(private shipmentsService: ShipmentsService, public newShipmentRef: MatDialogRef<NewShipmentComponent>, public createFailDialog: MatDialog
  ) { }

  ngOnInit() { }

  selectionChange() {
    this.selectedItems = this.itemsSelectionComponent.selection.selected;
    this.selectedContainers = this.containersSelectionComponent.selection.selected;
    this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
    this.checkItemsAndContainersSelected();
    console.log(this.allowAnalysis)
    console.log(this.selectedItems)
    console.log(this.selectedContainers)
  }

  checkItemsAndContainersSelected() {
    if (this.selectedContainers != null && this.selectedItems != null) {
      if (this.selectedContainers.length == 0 || this.selectedItems.length == 0) {
        this.allowAnalysis = false
      } else {
        this.allowAnalysis = true
      }
    }
  }

  startSpinner() {
    this.interval = setInterval(() => {
      this.spinnerValue = this.spinnerValue + 20 / this.timeoutDuration
      if (this.spinnerValue >= 100) {
        this.pauseSpinnerInterval();
        this.fastForwardSpinner();
      }
    }, 200)
  }

  fastForwardSpinner(shipment?) {
    this.spinnerValue = 100;
    this.interval = setInterval(() => {
      this.dwellTime = this.dwellTime - 200
      if (this.dwellTime < 0) {
        this.pauseSpinnerInterval();
        this.loading = false;
        this.newShipmentRef.close(shipment)
      }
    }, 200)
  }

  pauseSpinnerInterval() {
    clearInterval(this.interval);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  analyze() {
    this.startSpinner()
    this.loading = true;
    this.shipment.containers = this.selectedContainers;

    let shipmentItems: Item[] = []
    this.selectedItems.forEach(selectedItem => {
      for (let index = 0; index < selectedItem.qty; index++) {
        shipmentItems.push(selectedItem)
      }
    });
    this.shipment.items = shipmentItems;

    this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
    this.shipment.multiBinPack = this.multiBinPack;
    this.shipment.timeoutDuration = 30;
    this.shipment.title = this.title;

    this.shipmentsService.postArrangement(this.shipment).subscribe(shipment => {
      this.pauseSpinnerInterval();
      this.fastForwardSpinner(shipment)
    }, error => {
      if (error.detail == "Not found.") {
        this.close(); this.openCreateFailDialog();
      }
    }
    )
  }

  openCreateFailDialog(): void {
    const dialogRef = this.createFailDialog.open(CreateFailDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { type: "shipment" },
    });
  }
  close() {
    this.newShipmentRef.close();
  }
}
