import { Component, OnInit } from '@angular/core';
import { ContainersService } from 'src/app/_services/containers.service';
import { Container } from '../../_models/container'

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  containers: Container[]
  constructor(private containersservice: ContainersService) { }

  ngOnInit(): void {
    this.containersservice.getAll().subscribe(containers => { this.containers = containers; console.log(containers) })
  }
  hello() {
    console.log("hello")
  }

}
