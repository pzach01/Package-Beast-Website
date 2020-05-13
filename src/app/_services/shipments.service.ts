import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../_models/shipment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/arrangements/`);
  }

}
