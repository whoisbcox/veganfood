import { Component, Input, inject } from '@angular/core';
import { FoodItem } from '../../models/food-item';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FoodItemActions } from '../../store/actions/order.actions';

@Component({
  selector: 'app-food-item',
  standalone: true,
  imports: [],
  template: `
    <div class="food-item">
      <img class="food-item__img" src="" alt="Photo of {{foodItem.name}}">
      <h2 class="food-item__title">{{foodItem.name}}</h2>
      <p class="food-item__desc">{{foodItem.description}}</p>
      <p class="food-item__price">{{foodItem.price}}</p>
      <button (click)="foodItemAdded(foodItem.id)">Add to Order</button>
    </div>
  `,
  styleUrl: './food-item.component.css'
})
export class FoodItemComponent {
  @Input() foodItem!: FoodItem;
  private store = inject(Store);
  order$?: Observable<object>;
  title = 'veganfood';
  
  constructor() {
    this.order$ = this.store.select('order');
  }

  foodItemAdded(foodItemID: number) {
    this.store.dispatch(FoodItemActions.foodItemAdded({foodItemID}));
  }
  
  foodItemRemoved(foodItemID: number) {
    this.store.dispatch(FoodItemActions.foodItemRemoved({foodItemID}));
  }
}
