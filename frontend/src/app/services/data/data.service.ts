import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseURL: string = 'http://64.225.22.109:3001';

  constructor(private http: HttpClient) {}

  createItem(item: any): Observable<any> {
    return this.http.post(this.baseURL + '/items', item, {
      withCredentials: true,
    });
  }

  getItems(): Observable<any> {
    return this.http.get(this.baseURL + '/items', { withCredentials: true });
  }

  updateItem(item: any): Observable<any> {
    return this.http.put(this.baseURL + '/items', item, {
      withCredentials: true,
    });
  }

  deleteItem(itemId: any): Observable<any> {
    return this.http.delete(this.baseURL + '/items/' + itemId, {
      withCredentials: true,
    });
  }
}
