import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // let currentUser = this.authenticationService.currentUserValue;
        let currentToken = this.authenticationService.currentTokenValue;
        if (currentToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Token ${currentToken.key}`,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            });
        }

        return next.handle(request);
    }
}