import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe} from "@angular/common";
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, map } from 'rxjs';
import { FoodItemApiActions } from './store/actions/food-item.actions';
import { selectOrderSubTotal, selectOrderTotalQuantity, selectTransformedOrder } from './store/selectors/order.selectors';
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
export class AppComponent implements OnInit, OnDestroy {
  title = 'veganfood';
  salesTaxPercent: number;
  foodItems$: Observable<FoodItem[]>;
  order$?: Observable<OrderItem[]>;
  quantity$?: Observable<number>;
  subtotal: number;
  total: string;
  salesTax: string;
  subtotalSub$: Subscription | undefined;

  constructor(private store: Store<AppState>) {
    this.foodItems$ = this.store.select(state => state.foodItems.foodItems);
    this.order$ = this.store.select(selectTransformedOrder);
    this.quantity$ = this.store.select(selectOrderTotalQuantity);
    this.salesTaxPercent = 0.0725;
    this.salesTax = '0';
    this.subtotal = 0;
    this.total = '0';
  }

  ngOnInit() {
    this.store.dispatch(FoodItemApiActions.loadFoodItems());
    this.subtotalSub$ = this.store.pipe(select(selectOrderSubTotal)).subscribe((st: number) => {
      this.subtotal = parseFloat((st).toFixed(2));
      this.salesTax = this.formatAsUSD(this.calculateTax(this.subtotal, this.salesTaxPercent));
      this.total = this.formatAsUSD(this.calculateTotal(this.subtotal, this.salesTaxPercent));
    });
  }

  ngOnDestroy() {
    if (this.subtotalSub$) {
      this.subtotalSub$.unsubscribe();
    }
  }

  submitOrder() {
    fetch('create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          { id: 1, quantity: 3 },
          { id: 2, quantity: 1 }
        ]
      })
    }).then(res => {
      if (res.ok) return res.json();
      return res.json().then(json => Promise.reject(json));
    }).then(({ url }) => {
      window.location = url;
    }).catch(e => {
      console.log(e.error)
    });
  }

  calculateTax(amount: number, taxPercent: number) {
    return taxPercent * amount;
  };

  calculateTotal(amount: number, taxPercent: number) {
    return parseFloat((amount + this.calculateTax(amount, taxPercent)).toFixed(2));
  };

  formatAsUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}
