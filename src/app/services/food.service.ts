import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FoodItem } from '../models/food-item';
import foodItems from '../db/fooditems.json';


@Injectable({
  providedIn: 'root'
})
export class FoodService {
  protected foodItemList: FoodItem[] = foodItems;

  constructor() { }

  getAllFoodItems() : Observable<FoodItem[]> {
    return of(this.foodItemList);
  }

  getFoodItemsByType(type: String): Observable<FoodItem[]> {
    return of(this.foodItemList.filter(item => item.type === type));
  }

  getFoodItemsByIds(filterArray: number[]): Observable<FoodItem[]> {
    return of(this.foodItemList.filter(item => filterArray.includes(item.id)));
  }
}
