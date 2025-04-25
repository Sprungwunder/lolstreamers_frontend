import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "http://localhost:8000/api/token/";

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<string> {
    console.log("Logging in...");
    const response = await lastValueFrom(
      this.http.post<{ token: string }>(this.baseUrl, {
        username,
        password,
      })
    );

    if (!response.token) {
      throw new Error("Failed to obtain token.");
    }

    return response.token;
  }
}
