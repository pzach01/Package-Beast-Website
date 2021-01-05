import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../_models/shipment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${environment.API_BASE_URI}/arrangements/`);
  }
  getShipmentById(shipmentId: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${environment.API_BASE_URI}/arrangements/${shipmentId}/`);
  }
  postArrangement(shipment: Shipment): Observable<Shipment> {
    return this.http.post<Shipment>(`${environment.API_BASE_URI}/arrangements/`, shipment);
  }
  deleteArrangement(shipment: Shipment): Observable<Shipment> {
    return this.http.delete<Shipment>(`${environment.API_BASE_URI}/arrangements/${shipment.id}/`);
  }
}
