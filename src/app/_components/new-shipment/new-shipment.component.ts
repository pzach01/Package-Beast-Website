import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsSelectionComponent } from '../items-selection/items-selection.component';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { ContainersSelectionComponent } from 'src/app/_components/containers-selection/containers-selection.component';

@Component({
  selector: 'app-new-shipment',
  templateUrl: './new-shipment.component.html',
  styleUrls: ['./new-shipment.component.scss']
})
export class NewShipmentComponent implements OnInit {


  @ViewChild(ItemsSelectionComponent) itemsSelectionComponent: ItemsSelectionComponent;
  @ViewChild(ContainersSelectionComponent) containersSelectionComponent: ContainersSelectionComponent;

  selectedItems: Item[];
  selectedContainers: Container[];

  constructor() { }

  ngOnInit() { }

  selectionChange() {
    this.selectedItems = this.itemsSelectionComponent.selection.selected;
    this.selectedContainers = this.containersSelectionComponent.selection.selected;

  }
}
