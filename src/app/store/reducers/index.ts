import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { foodItemReducer, FoodItemState } from './food-item.reducer';
import { CodecState, orderReducer } from './order.reducer';

export interface State {
  foodItems: FoodItemState;
  order: CodecState;
}

export const reducers: ActionReducerMap<State> = {
  foodItems: foodItemReducer,
  order: orderReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
