import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FoodService } from '../../services/food.service';
import { FoodItemApiActions } from '../actions/food-item.actions';
import { FoodItem } from '../../models/food-item';

@Injectable()
export class FoodItemEffects {
  loadFoodItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodItemApiActions.loadFoodItems),
      mergeMap(() =>
        this.foodService.getAllFoodItems().pipe(
          map((foodItems: FoodItem[]) => {
            return FoodItemApiActions.loadFoodItemsSuccess({ foodItems });
          }),
          catchError((error: any) => of(FoodItemApiActions.loadFoodItemsFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private foodService: FoodService) {}
}
