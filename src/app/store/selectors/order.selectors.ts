import { createSelector } from '@ngrx/store';
import { FoodItem } from '../../models/food-item';
import { OrderItem } from '../../models/order-item';
import { AppState } from '../../models/app.state';
import { FoodItemState } from '../reducers/food-item.reducer';

const selectFoodItems = (state: AppState) => state.foodItems;
const selectOrder = (state: AppState) => state.order;

export const selectTransformedOrder = createSelector(
  selectFoodItems,
  selectOrder,
  (foodItems: FoodItemState, order: number[]) => {
    const orderMap = new Map<number, OrderItem>();

    order.forEach(id => {
      console.log(id);
      if (orderMap.has(id)) {
        const existingItem = orderMap.get(id)!;
        existingItem.quantity += 1;
        existingItem.total += existingItem.price;
      } else {
        const { foodItems: items} = foodItems;
        const foodItem = items.find(item => item.id === id);
        if (foodItem) {
          orderMap.set(id, {
            ...foodItem, quantity: 1, total: foodItem.price,
            key: ''
          });
        }
      }
    });

    return Array.from(orderMap.values()).map((item, index) => ({ ...item, key: `${item.id}-${index}` }));
  }
);
function useSelector(selectFoodItems: (state: AppState) => FoodItem[]) {
  throw new Error('Function not implemented.');
}

