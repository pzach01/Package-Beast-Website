import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container, ThirdPartyContainer } from '../_models/container';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Container[]> {
    return this.http.get<Container[]>(`${environment.API_BASE_URI}/containers/`);
  }

  getAllThirdPartyContainers(): Observable<ThirdPartyContainer[]> {
    return this.http.get<ThirdPartyContainer[]>(`${environment.API_BASE_URI}/third-party-containers/`);
  }

  postContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(`${environment.API_BASE_URI}/containers/`, container);
  }

  putContainer(container: Container): Observable<Container> {
    return this.http.put<Container>(`${environment.API_BASE_URI}/containers/${container.id}/`, container);
  }

  deleteItem(container: Container): Observable<Container> {
    return this.http.delete<Container>(`${environment.API_BASE_URI}/containers/${container.id}/`);
  }
}
