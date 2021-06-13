import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Quote } from 'src/app/_models/quote';
import { Shipment } from 'src/app/_models/shipment';
import { faUps, faUsps } from '@fortawesome/free-brands-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { ShipmentsService } from 'src/app/_services/shipments.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  faUps = faUps;
  faUsps = faUsps;
  faCheckCircle = faCheckCircle;
  displayedColumns: string[] = ["selectedIcon", "carrier", "cost", "daysToShip", "serviceDescription"];
  dataSource;
  loading: boolean = false
  userHasQuotes = true
  shipment: Observable<Shipment>
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private shipmentsService: ShipmentsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.shipment = of(window.history.state.shipment);

    if (!window.history.state.quotes) {
      // No quotes. Better get a shipment from the backend
      const shipmentId = +this.route.parent.snapshot.params['id'];
      this.shipment = this.shipmentsService.getShipmentById(shipmentId)
    }
    this.shipment.subscribe(shipment => {
      console.log(shipment)
      if (shipment) {
        this.dataSource = new MatTableDataSource(shipment.quotes);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openQuoteDetail(quote: Quote) {
    this.shipment.subscribe(shipment => {
      this.shipmentsService.setLastSelectedQuote(shipment, quote).subscribe(() => {
        this.router.navigate(['./', { outlets: { view: ['shipments', +this.route.parent.snapshot.params['id'], 'quotes', quote.id] } }]);
      }), e => console.log(e)
    })
  }
}
