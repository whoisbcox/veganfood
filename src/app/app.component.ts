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
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matTakeoutDiningOutline } from '@ng-icons/material-icons/outline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, HomeComponent, NgIconComponent, RouterLink, RouterOutlet],
  providers: [provideIcons({matTakeoutDiningOutline})],
  template: `
    <main>
    <header class="flex fixed justify-between md:items-center top-0 left-0 right-0 z-10 p-4 bg-deep-blue text-off-white">
      <h1 class="font-display text-4xl text-white"><a routerLink="/">{{title}}</a></h1>
      <nav class="md:flex">
        <ul class="md:flex">
          <li class="content-center"><a class="px-4" routerLink="/menu">Menu</a></li>
          <li class="content-center"><a class="px-4" routerLink="/">Locations</a></li>
          <li class="pl-3">
            <a class="px-6 py-2 inline-flex items-center rounded-full bg-yellow-light text-deep-blue" routerLink="/order">
              Order&ensp;<ng-icon name="matTakeoutDiningOutline" size="24px"></ng-icon> {{quantity$ | async}}
            </a>
          </li>
        </ul>
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
