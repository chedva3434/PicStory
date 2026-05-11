import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://localhost:7213/api/Auth/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(this.apiUrl, {
      username,
      passwordHash: password
    });
  }
}