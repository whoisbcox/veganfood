import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FoodItem } from '../../models/food-item';

export const FoodItemApiActions = createActionGroup({
  source: 'Food Item API',
  events: {
    'Load Food Items': emptyProps(),
    'Load Food Items Success': props<{ foodItems: FoodItem[] }>(),
    'Load Food Items Failure': props<{ error: any }>(),
  },
});