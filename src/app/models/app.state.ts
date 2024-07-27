import { FoodItemState } from "../store/reducers/food-item.reducer";
import { FoodItem } from "./food-item";

export interface AppState {
  foodItems: FoodItemState;
  order: string[];
}