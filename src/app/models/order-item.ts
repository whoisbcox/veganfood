import { FoodItem } from "./food-item";

export interface OrderItem extends FoodItem {
  quantity: number;
  total: number;
  key: string;
}