import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../_models/item'

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/boxes/`);
  }

  postItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/boxes/`, item);
  }
}
