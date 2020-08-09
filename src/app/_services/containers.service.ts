import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from '../_models/container';
import { Constants } from '../_models/constants';

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Container[]> {
    return this.http.get<Container[]>(`${Constants.API_BASE_URI}/containers/`);
  }

  postContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(`${Constants.API_BASE_URI}/containers/`, container);
  }

  putContainer(container: Container): Observable<Container> {
    return this.http.put<Container>(`${Constants.API_BASE_URI}/containers/${container.id}/`, container);
  }

  deleteItem(container: Container): Observable<Container> {
    return this.http.delete<Container>(`${Constants.API_BASE_URI}/containers/${container.id}/`);
  }
}
