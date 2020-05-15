import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from '../_models/container';

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Container[]> {
    return this.http.get<Container[]>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/containers/`);
  }

  postContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/containers/`, container);
  }
}
