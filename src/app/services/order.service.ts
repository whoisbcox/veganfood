import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/create-checkout-sessions`;

  constructor(private http: HttpClient) {}

  createOrder(order: any) {
    return this.http.post<{url: string}>(this.apiUrl, order);
  }
}
