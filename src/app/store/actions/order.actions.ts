import { createActionGroup, props } from '@ngrx/store';

export const FoodItemActions = createActionGroup({
  source: 'Food Item',
  events: {
    'Food Item Added': props<{ foodItemID: number }>(),
    'Food Item Removed': props<{ foodItemID: number }>(),
  },
});