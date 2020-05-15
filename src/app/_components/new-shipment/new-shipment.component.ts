import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsSelectionComponent } from '../items-selection/items-selection.component';
import { Item } from 'src/app/_models/item';

@Component({
  selector: 'app-new-shipment',
  templateUrl: './new-shipment.component.html',
  styleUrls: ['./new-shipment.component.scss']
})
export class NewShipmentComponent implements OnInit {


  @ViewChild(ItemsSelectionComponent) itemsSelectionComponent: ItemsSelectionComponent;
  selectedItems: Item[];

  constructor() { }

  ngOnInit() { }

  selectionChange() {
    this.selectedItems = this.itemsSelectionComponent.selection.selected;
  }
}
