import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.apiUrl + "/api/token/";
  private loggedInKey: string = 'user_logged_in';


  constructor(private http: HttpClient) {
  }

  async login(username: string, password: string) {
    console.log("Logging in...");
    const response = await lastValueFrom(this.http.post(this.baseUrl, {username, password}, {
      withCredentials: true  // Important! This allows cookies to be sent/received
    }));
    sessionStorage.setItem(this.loggedInKey, 'true');
    return response;
  }

  logout() {
    // Call the logout endpoint to clear the cookie on the server
    return lastValueFrom(this.http.post(`${this.baseUrl}logout/`, {}, {
      withCredentials: true
    })).then(() => {
      // Clear the login state flag
      sessionStorage.removeItem(this.loggedInKey);
    }).catch(error => {
      console.error('Logout error:', error);
      // Even if the server call fails, clear the local login state
      sessionStorage.removeItem(this.loggedInKey);
    });
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.loggedInKey) === 'true';
  }

}
