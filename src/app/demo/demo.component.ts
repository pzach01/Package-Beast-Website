import { Component, OnInit } from '@angular/core';
import { Container } from '../_models/container';
import { Item } from '../_models/item';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  container: Container =
    {
      "id": 3429,
      "sku": "Abvcc",
      "description": "Ccf",
      "xDim": 10.0,
      "yDim": 9.0,
      "zDim": 9.0,
      "volume": 810.0,
      "units": "in"
    }
  items: Item[] = [
    {
      "id": 10836,
      "container": 3429,
      "sku": "Abc",
      "description": "Abc",
      "length": 3.0,
      "width": 4.0,
      "height": 6.0,
      "xDim": 6.0,
      "yDim": 4.0,
      "zDim": 3.0,
      "volume": 72.0,
      "xCenter": 3.0,
      "yCenter": 2.0,
      "zCenter": 1.5,
      "units": "in",
      "masterItemId": 9636,
      "qty": 1
    },
    {
      "id": 10837,
      "container": 3429,
      "sku": "Abc",
      "description": "Abc",
      "length": 3.0,
      "width": 4.0,
      "height": 6.0,
      "xDim": 6.0,
      "yDim": 4.0,
      "zDim": 3.0,
      "volume": 72.0,
      "xCenter": 3.0,
      "yCenter": 2.0,
      "zCenter": 4.5,
      "units": "in",
      "masterItemId": 9636,
      "qty": 1
    },
    {
      "id": 10838,
      "container": 3429,
      "sku": "Abc",
      "description": "Abc",
      "length": 3.0,
      "width": 4.0,
      "height": 6.0,
      "xDim": 6.0,
      "yDim": 4.0,
      "zDim": 3.0,
      "volume": 72.0,
      "xCenter": 3.0,
      "yCenter": 2.0,
      "zCenter": 7.5,
      "units": "in",
      "masterItemId": 9636,
      "qty": 1
    }
  ]
  constructor() { }

  ngOnInit(): void {

  }

}
