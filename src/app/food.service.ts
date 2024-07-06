import { Injectable } from '@angular/core';
import { FoodItem } from './food-item';
import foodItems from './db/fooditems.json';


@Injectable({
  providedIn: 'root'
})
export class FoodService {
  protected foodItemList: FoodItem[] = foodItems;

  constructor() { }

  getAllFoodItems() : FoodItem[] {
    return this.foodItemList;
  }

  getFoodItemsByType(type: String): FoodItem[] | [] {
    return this.foodItemList.filter(item => item.type === type);
  }

  getFoodItemsByIds(filterArray: Array<Number>): FoodItem[] | [] {
    return this.foodItemList.filter(item => filterArray.includes(item.id));
  }
}
