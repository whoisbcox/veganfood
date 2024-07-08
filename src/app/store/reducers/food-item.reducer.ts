import { createReducer, on } from '@ngrx/store';
import { FoodItem } from '../../models/food-item';
import { FoodItemApiActions } from '../../store/actions/food-item.actions';

export interface FoodItemState {
  foodItems: FoodItem[];
  error: any;
}

export const initialState: FoodItemState = {
  foodItems: [],
  error: null,
};

export const foodItemReducer = createReducer(
  initialState,
  on(FoodItemApiActions.loadFoodItems, (_state) => ({..._state, error: null })),
  on(FoodItemApiActions.loadFoodItemsSuccess, (_state, { foodItems }) => ({..._state, foodItems })),
  on(FoodItemApiActions.loadFoodItemsFailure, (_state, { error }) => ({..._state, error })),

);