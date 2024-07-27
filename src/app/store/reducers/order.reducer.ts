import { createReducer, on } from '@ngrx/store';
import { FoodItemActions } from '../../store/actions/order.actions';

export type CodecState = string[];

export const initialState: CodecState = [];

export const orderReducer = createReducer<CodecState>(
  initialState,
  on(FoodItemActions.foodItemRemoved, (state, { foodItemID }) => {
    const index = state.indexOf(foodItemID);
    if (index !== -1) {
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    return state;
  }),
  on(FoodItemActions.foodItemAdded, (state, { foodItemID }) => {
    return [...state, foodItemID];
  })
);