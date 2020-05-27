import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';

@Component({
  selector: 'app-review-shipment',
  templateUrl: './review-shipment.component.html',
  styleUrls: ['./review-shipment.component.scss']
})
export class ReviewShipmentComponent implements OnInit {
  @Input() selectedItems: Item[];
  @Input() selectedContainers: Container[];
  multiBinPack: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
