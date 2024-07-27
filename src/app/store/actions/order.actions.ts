import { createActionGroup, props } from '@ngrx/store';

export const FoodItemActions = createActionGroup({
  source: 'Food Item',
  events: {
    'Food Item Added': props<{ foodItemID: string }>(),
    'Food Item Removed': props<{ foodItemID: string }>(),
  },
});