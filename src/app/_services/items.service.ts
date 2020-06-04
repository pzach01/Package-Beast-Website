import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../_models/item'
import { Constants } from '../_models/constants';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(`${Constants.API_BASE_URI}/items/`);
  }

  postItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${Constants.API_BASE_URI}/items/`, item);
  }

  putItem(item: Item): Observable<Item> {
    console.log(item)
    return this.http.put<Item>(`${Constants.API_BASE_URI}/items/${item.id}/`, item);
  }

  deleteItem(item: Item): Observable<Item> {
    console.log(item)
    return this.http.delete<Item>(`${Constants.API_BASE_URI}/items/${item.id}/`);
  }
}
