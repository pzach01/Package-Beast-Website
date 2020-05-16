import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { Constants } from '../_models/constants';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${Constants.API_BASE_URI}/users/`);
    }

    register(user: User) {
        return this.http.post(`${Constants.API_BASE_URI}/accounts/registration/`, user);
    }

    delete(id: number) {
        return this.http.delete(`${Constants.API_BASE_URI}/users/${id}`);
    }
}