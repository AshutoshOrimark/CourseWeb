import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseURL = environment.apiUrl + "/auth"; // Use baseURL from environment

  createUser(formData: { name: string; email: string; password: string; phone: string; provider: string; role: string }) {
    return this.http.post(`${this.baseURL}/register`, formData);
  }

  login(formData: { email: string; password: string }) {
    return this.http.post(`${this.baseURL}/login`, formData);
  }
}
