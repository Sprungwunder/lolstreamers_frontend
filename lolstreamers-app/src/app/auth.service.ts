import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.apiUrl + "/api/token/";
  private csrfUrl: string = environment.apiUrl + "/api/csrf/";
  private refreshUrl: string = environment.apiUrl + "/api/token/refresh/";

  private loggedInKey: string = 'user_logged_in';

  constructor(private http: HttpClient) {
  }

  // First get the CSRF token
  private async getCsrfToken() {
    await firstValueFrom(this.http.get(this.csrfUrl, {withCredentials: true}));
  }

  async login(username: string, password: string) {
    await this.getCsrfToken();

    const response = await lastValueFrom(this.http.post(this.baseUrl, {username, password}, {
      withCredentials: true  // Important! This allows cookies to be sent/received
    }));
    sessionStorage.setItem(this.loggedInKey, 'true');
    return response;
  }

  async logout() {
    // Call the logout endpoint to clear the cookie on the server
    return lastValueFrom(this.http.post(`${this.baseUrl}logout/`, {}, {
      withCredentials: true
    })).then(() => {
      // Clear the login state flag
      sessionStorage.removeItem(this.loggedInKey);
    }).catch(() => {
      // Even if the server call fails, clear the local login state
      sessionStorage.removeItem(this.loggedInKey);
    });
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.loggedInKey) === 'true';
  }

  refreshToken(): Observable<any> {
    // For HTTP-only cookies, we don't need to manually include the refresh token
    // The browser will automatically include the cookie with the request
    return this.http.post(this.refreshUrl, {}, {
      withCredentials: true
    });
  }
}
