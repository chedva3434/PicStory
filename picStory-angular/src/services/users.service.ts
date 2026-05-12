import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createUser(user: any) {
    return this.http.post(this.apiUrl, {
      Name: user.name,
      Email: user.email,
      PasswordHash: user.passwordHash,
      Role: user.role ?? 'User'
    });
  }

  updateUser(id: number, user: any) {
    return this.http.put(`${this.apiUrl}/${id}`, {
      Name: user.name,
      Email: user.email,
      PasswordHash: user.passwordHash,
      Role: user.role
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getStats() {
    return this.http.get<any>(`${environment.apiUrl}/Dashboard/stats`);
  }

  getPhotos() {
    return this.http.get<any[]>(`${environment.apiUrl}/Photo`);
  }
}