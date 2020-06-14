import { Component, Input, OnChanges } from '@angular/core';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-review-shipment',
  templateUrl: './review-shipment.component.html',
  styleUrls: ['./review-shipment.component.scss']
})
export class ReviewShipmentComponent implements OnChanges {
  @Input() selectedItems: Item[];
  @Input() selectedContainers: Container[];
  multiBinPack: boolean = false;
  itemsDataSource = new MatTableDataSource(this.selectedItems);
  containersDataSource = new MatTableDataSource(this.selectedContainers);
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description'];

  constructor() { }

  ngOnChanges() {
    this.itemsDataSource.data = this.selectedItems;
    this.containersDataSource.data = this.selectedContainers;
  }

}
