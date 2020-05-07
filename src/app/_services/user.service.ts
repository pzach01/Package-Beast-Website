import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/users/`);
    }

    register(user: User) {
        return this.http.post(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/accounts/registration/`, user);
    }

    delete(id: number) {
        return this.http.delete(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/users/${id}`);
    }
}