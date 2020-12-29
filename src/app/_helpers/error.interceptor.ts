import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err instanceof HttpErrorResponse) {
                console.log("eee", err)
                if (err.status === 401) {
                    // auto logout and redirect if 401 response returned from api
                    this.authenticationService.logout();
                    this.router.navigate([{ outlets: { primary: 'login', view: null } }]);

                    // location.reload(true);
                }

                return throwError(err.error);
            }
        }))
    }
}