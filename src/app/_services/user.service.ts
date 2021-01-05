import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.API_BASE_URI}/users/`);
    }

    register(user: User) {
        return this.http.post(`${environment.API_BASE_URI}/accounts/registration/`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.API_BASE_URI}/users/${id}/`);
    }

}