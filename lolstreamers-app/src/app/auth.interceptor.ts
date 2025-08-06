import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Flag to track refresh status
let isRefreshing = false;
// Subject to notify when token refresh is complete
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Clone the request to ensure credentials are included
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Handle 401 errors by refreshing the token
        return handleUnauthorizedError(authReq, next, authService);
      }

      // For other errors, just propagate them
      return throwError(() => error);
    })
  );
};

function handleUnauthorizedError(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    // Start the refresh process
    isRefreshing = true;
    refreshTokenSubject.next(false);

    return authService.refreshToken().pipe(
      switchMap(() => {
        // Mark refresh as complete
        isRefreshing = false;
        refreshTokenSubject.next(true);

        // Retry the original request
        return next(request);
      }),
      catchError(err => {
        // If refresh fails, reset flag and logout user
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // If refresh is already in progress, wait for it to complete
    return refreshTokenSubject.pipe(
      filter(refreshed => refreshed),
      take(1),
      switchMap(() => next(request))
    );
  }
}
