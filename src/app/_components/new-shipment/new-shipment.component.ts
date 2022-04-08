import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemsSelectionComponent } from '../items-selection/items-selection.component';
import { Item } from 'src/app/_models/item';
import { Container, ThirdPartyContainer } from 'src/app/_models/container';
import { ContainersSelectionComponent } from 'src/app/_components/containers-selection/containers-selection.component';
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { Shipment } from 'src/app/_models/shipment';
import { ReviewShipmentComponent } from '../review-shipment/review-shipment.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateFailDialogComponent } from '../create-fail-dialog/create-fail-dialog.component';
import { ShipFromComponent } from '../ship-from/ship-from.component';
import { ShipToComponent } from '../ship-to/ship-to.component';
import { Address } from 'src/app/_models/address';
import { MatStepper } from '@angular/material/stepper';
import { ContainersService } from 'src/app/_services/containers.service';

@Component({
  selector: 'app-new-shipment',
  templateUrl: './new-shipment.component.html',
  styleUrls: ['./new-shipment.component.scss']
})
export class NewShipmentComponent implements OnInit {

  @ViewChild(ItemsSelectionComponent) itemsSelectionComponent: ItemsSelectionComponent;
  @ViewChild(ContainersSelectionComponent) containersSelectionComponent: ContainersSelectionComponent;
  @ViewChild(ReviewShipmentComponent) reviewShipmentComponent: ReviewShipmentComponent;
  @ViewChild(ShipFromComponent) shipFromComponent: ShipFromComponent;
  @ViewChild(ShipToComponent) shipToComponent: ShipToComponent;

  selectedItems: Item[];
  selectedContainers: Container[];
  multiBinPack: boolean = false;
  shipment: Shipment = new Shipment();
  shipFromAddress: Address
  shipToAddress: Address
  loading = false;
  interval;
  spinnerValue = 0;
  timeoutDuration = 30;
  fastForwardtimeoutDuration = 2;
  dwellTime = 1000; //ms
  allowAnalysis: boolean = false;
  newShipmentTitle: string = "My New Shipment";
  stepper: MatStepper

  constructor(private shipmentsService: ShipmentsService, private containersService: ContainersService, public newShipmentRef: MatDialogRef<NewShipmentComponent>, public createFailDialog: MatDialog, private el: ElementRef
  ) { }

  ngOnInit(): void {

    this.containersService.getAllThirdPartyContainers().subscribe((thirdPartyContainers => {
      this.containersSelectionComponent.thirdPartyContainers = thirdPartyContainers
      console.log(thirdPartyContainers)
    }))
  }

  selectionChange() {
    this.selectedItems = this.itemsSelectionComponent.selection.selected;
    this.selectedContainers = this.containersSelectionComponent.selection.selected;
    this.shipFromAddress = new Address(this.shipFromComponent.addressForm.value)
    this.shipToAddress = new Address(this.shipToComponent.addressForm.value)

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

  scrollToErrorField() {

    const firstElementWithError = document.querySelector('textarea.ng-invalid, input.ng-invalid, select.ng-invalid')

    if (firstElementWithError) {
      console.log(firstElementWithError)
      firstElementWithError.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
    }

  }

  analyze(stepper: MatStepper) {

    if (!this.shipFromComponent.addressForm.valid) {
      stepper.selectedIndex = 0;
      this.shipFromComponent.addressForm.markAllAsTouched()
      this.scrollToErrorField()
    }
    else if (!this.shipToComponent.addressForm.valid) {
      stepper.selectedIndex = 1;
      this.shipToComponent.addressForm.markAllAsTouched()
      this.scrollToErrorField()
    }
    else {
      this.startSpinner()
      this.loading = true;
      this.shipment.containers = this.selectedContainers;

      let shipmentItems: Item[] = []
      this.selectedItems.forEach(selectedItem => {
        for (let index = 0; index < selectedItem.qty; index++) {
          //If statement probably not necessary
          if (selectedItem.weight <= 0) {
            selectedItem.weight = 1;
          }
          shipmentItems.push(selectedItem)
        }
      });
      this.shipment.items = shipmentItems;

      this.multiBinPack = this.reviewShipmentComponent.multiBinPack;
      this.shipment.multiBinPack = this.multiBinPack;
      this.shipment.timeoutDuration = 30;
      this.shipment.title = this.newShipmentTitle;
      this.shipment.lastSelectedQuoteId = 0;
      this.shipment.shipFromAddress = this.shipFromAddress;
      this.shipment.shipToAddress = this.shipToAddress;
      this.shipment.includeUpsContainers = this.containersSelectionComponent.includeUpsContainers;
      this.shipment.includeUspsContainers = this.containersSelectionComponent.includeUspsContainers;

      this.shipmentsService.postShipment(this.shipment).subscribe(shipment => {
        this.pauseSpinnerInterval();
        this.fastForwardSpinner(shipment)
      }, error => {
        console.log(error)
        if (error.detail == "Not found.") {
          this.close(); this.openCreateFailDialog();
        }
      }
      )
    }
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
