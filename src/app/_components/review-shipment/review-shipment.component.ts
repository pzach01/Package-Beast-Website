import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-review-shipment',
  templateUrl: './review-shipment.component.html',
  styleUrls: ['./review-shipment.component.scss']
})
export class ReviewShipmentComponent implements OnChanges, OnInit {
  @Input() selectedItems: Item[];
  @Input() selectedContainers: Container[];
  currentUser = this.authenticationService.currentUserValue;
  multiBinPack: boolean = this.currentUser.multiBinPack;
  itemsDataSource;
  containersDataSource;
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description', 'xDim', 'zDim', 'yDim', 'volume'];
  constructor(private authenticationService: AuthenticationService) { }
  allowAnalysis: boolean = false;
  ngOnInit() {
    this.itemsDataSource = new MatTableDataSource(this.selectedItems);
    this.containersDataSource = new MatTableDataSource(this.selectedContainers);
    this.checkItemsAndContainersSelected()
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }
  ngOnChanges() {
    if (this.selectedItems != null) {
      this.itemsDataSource.data = this.selectedItems;
    }
    if (this.selectedContainers != null) {
      this.containersDataSource.data = this.selectedContainers;
    }
    this.checkItemsAndContainersSelected()
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

}
