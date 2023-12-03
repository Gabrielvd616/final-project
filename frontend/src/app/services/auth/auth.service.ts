import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string = 'http://64.225.22.109:3001';
  private wasLoggedIn = false;
  private subject = new Subject<any>();

  constructor(private http: HttpClient) {}

  registerUser(user: any): Observable<any> {
    return this.http.post(this.baseURL + '/users', user, {
      withCredentials: true,
    });
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(this.baseURL + '/users/login', credentials, {
      withCredentials: true,
    });
  }

  logoutUser(): Observable<any> {
    return this.http.get(this.baseURL + '/users/logout', {
      withCredentials: true,
    });
  }

  isLoggedIn(): Observable<any> {
    return this.http.get(this.baseURL + '/users/test', {
      withCredentials: true,
    });
  }

  getLoginStatus(): Observable<any> {
    return this.subject.asObservable();
  }

  checkIfWasLoggedIn(): boolean {
    return this.wasLoggedIn;
  }

  setWasLoggedIn(): void {
    if (!this.wasLoggedIn) {
      this.wasLoggedIn = true;
      this.subject.next(this.wasLoggedIn);
    }
  }

  resetWasLoggedIn(): void {
    if (this.wasLoggedIn) {
      this.wasLoggedIn = false;
      this.subject.next(this.wasLoggedIn);
    }
  }
}
