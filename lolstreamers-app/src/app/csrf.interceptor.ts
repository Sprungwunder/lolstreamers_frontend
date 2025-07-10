import {HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';

export const csrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Skip for GET requests (they don't modify state)
  if (req.method === 'GET') {
    return next(req);
  }

  // Get the CSRF token from the cookie
  const csrfToken = getCsrfToken();

  // If token exists, clone the request and add the token header
  if (csrfToken) {
    req = req.clone({
      headers: req.headers.set('X-CSRFToken', csrfToken)
    });
  }

  return next(req);
};

function getCsrfToken(): string {
  // Extract CSRF token from cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return '';
}
