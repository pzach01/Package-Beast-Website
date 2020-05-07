import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/_services/items.service';
import { Item } from 'src/app/_models/item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[];
  constructor(private itemsservice: ItemsService) { }

  ngOnInit(): void {
    this.itemsservice.getAll().subscribe(items => { this.items = items; console.log(items) })
  }
  hello() {
    console.log("hello")
  }

}
