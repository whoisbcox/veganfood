import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe} from "@angular/common";
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { FoodItemApiActions } from './store/actions/food-item.actions';
import { selectTransformedOrder } from './store/selectors/order.selectors';
import { AppState } from './models/app.state';
import { HomeComponent } from './layouts/home/home.component';
import { OrderItem } from './models/order-item';
import { FoodItem } from './models/food-item';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterLink, RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'veganfood';
  // private store = inject(Store);
  foodItems$: Observable<FoodItem[]>;
  order$?: Observable<OrderItem[]>;
  total$?: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.foodItems$ = this.store.select(state => state.foodItems.foodItems);
    this.order$ = this.store.select(selectTransformedOrder);
    this.total$ = this.order$.pipe(
      map((items: OrderItem[]) => items.reduce((acc, item) => acc + item.total, 0))
    );
  }

  ngOnInit() {
    this.store.dispatch(FoodItemApiActions.loadFoodItems());
    this.order$ = this.store.select(selectTransformedOrder);
    this.total$ = this.order$.pipe(
      map(items => items.reduce((acc, item) => acc + item.total, 0))
    );
  }
}
