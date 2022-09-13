import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../_models/shipment';
import { environment } from 'src/environments/environment';
import { Arrangement } from '../_models/arrangement';
import { Quote } from '../_models/quote';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Shipment[]> {
    console.log('fetching shipments')
    return this.http.get<Shipment[]>(`${environment.API_BASE_URI}/simpleshipments/`).pipe(map(res => res), shareReplay(1));
  }
  getSimpleShipmentById(shipmentId: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${environment.API_BASE_URI}/simple-shipment/${shipmentId}/`);
  }

  getArrangementById(arrangementID: number): Observable<Arrangement> {
    return this.http.get<Arrangement>(`${environment.API_BASE_URI}/arrangements/${arrangementID}/`);
  }

  getQuoteById(quoteId: number): Observable<Quote> {
    return this.http.get<Quote>(`${environment.API_BASE_URI}/quotes/${quoteId}/`);
  }

  postArrangement(arrangement: Arrangement): Observable<Arrangement> {
    return this.http.post<Arrangement>(`${environment.API_BASE_URI}/arrangements/`, arrangement);
  }

  postShipment(shipment: Shipment): Observable<Shipment> {
    console.log('shipment before post', shipment)
    return this.http.post<Shipment>(`${environment.API_BASE_URI}/shipments/`, shipment);
  }

  setLastSelectedQuote(shipment: Shipment, quote: Quote): Observable<Shipment> {
    return this.http.patch<Shipment>(`${environment.API_BASE_URI}/shipments/${shipment.id}/`, { "lastSelectedQuoteId": quote.id });
  }

  deleteArrangement(arrangement: Arrangement): Observable<Shipment> {
    return this.http.delete<Shipment>(`${environment.API_BASE_URI}/arrangements/${arrangement.id}/`);
  }

  deleteShipment(shipment: Shipment): Observable<Shipment> {
    return this.http.delete<Shipment>(`${environment.API_BASE_URI}/shipments/${shipment.id}/`);
  }
}
