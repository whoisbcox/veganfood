import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FoodItem } from '../models/food-item';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = `${environment.apiUrl}/food-items`;

  constructor(private http: HttpClient) {}

  getAllFoodItems() : Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(this.apiUrl);
  }

  getFoodItemsByType(type: string): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.apiUrl}?type=${type}`);
  }

  getFoodItemsByIds(filterArray: string[]): Observable<FoodItem[]> {
    const ids = filterArray.join(',');
    return this.http.get<FoodItem[]>(`${this.apiUrl}?ids=${ids}`);
  }
}
