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
  itemsDataSource = new MatTableDataSource(this.selectedItems);
  containersDataSource = new MatTableDataSource(this.selectedContainers);
  itemsDisplayedColumns: string[] = ['sku', 'description', 'qty'];
  containersDisplayedColumns: string[] = ['sku', 'description'];

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }
  ngOnChanges() {
    this.itemsDataSource.data = this.selectedItems;
    this.containersDataSource.data = this.selectedContainers;
  }

}
