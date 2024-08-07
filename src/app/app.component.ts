import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe} from "@angular/common";
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, map, take } from 'rxjs';
import { FoodItemApiActions } from './store/actions/food-item.actions';
import { selectOrderSubTotal, selectOrderTotalQuantity, selectTransformedOrder } from './store/selectors/order.selectors';
import { AppState } from './models/app.state';
import { HomeComponent } from './layouts/home/home.component';
import { OrderItem } from './models/order-item';
import { FoodItem } from './models/food-item';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterLink, RouterOutlet, AsyncPipe],
  template: `
    <main>
    <header class="flex fixed justify-between md:items-center top-0 left-0 right-0 z-10 p-4 bg-deep-blue text-off-white">
      <h1 class="font-display text-4xl text-white"><a routerLink="/">{{title}}</a></h1>
      <nav class="md:flex">
        <ul class="md:flex">
          <li><a class="px-4" routerLink="/menu">Menu</a></li>
          <li><a class="px-4" routerLink="/">Locations</a></li>
          <li><a class="px-4" routerLink="/order">Cart</a></li>
        </ul>
        <div>{{quantity$ | async}}</div>
      </nav>
    </header>
    <section class="content">
      <router-outlet />
    </section>
  </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Lotus Garden';
  quantity$?: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.quantity$ = this.store.select(selectOrderTotalQuantity);
  }

  ngOnInit() {
    this.store.dispatch(FoodItemApiActions.loadFoodItems());
  }
}
