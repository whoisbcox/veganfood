import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, map, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppState } from '../../models/app.state';
import { FoodItem } from '../../models/food-item';
import { OrderItem } from '../../models/order-item';
import { selectTransformedOrder, selectOrderTotalQuantity, selectOrderSubTotal } from '../../store/selectors/order.selectors';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary } from '@cloudinary/url-gen/index';
import { CloudinaryModule } from '@cloudinary/ng';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matAddOutline, matMinusOutline, matSentimentDissatisfiedOutline } from '@ng-icons/material-icons/outline';
import { FoodItemActions } from '../../store/actions/order.actions';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [AsyncPipe, CloudinaryModule, NgIconComponent, RouterLink],
  providers: [provideIcons({matMinusOutline, matAddOutline, matSentimentDissatisfiedOutline})],
  template: `
    <div class="container max-w-screen-lg mx-auto">
      <h1 class="font-display text-4xl text-green text-center">Order Summary</h1>
      @for(order of order$ | async; track order.key) {
        <div class="flex gap-4 p-4 border-b border-gray-200">
          <figure class="rounded-md overflow-hidden">
            <img [src]="getCloudinaryImage(order.image)" alt="Photo of {{order.name}}">
          </figure>
          <div class="flex flex-1 items-center gap-4">
            <div class="flex items-center gap-2">
              <button
                class="w-7 h-7 flex flex-col justify-center items-center border-2 border-red-dark rounded-full"
                (click)="foodItemRemoved(order._id)"
              >
                <ng-icon name="matMinusOutline"></ng-icon>
              </button>
              <div class="w-6 h-6 inline-flex flex-col justify-center items-center">{{ order.quantity }}</div>
              <button
                class="w-7 h-7 flex flex-col justify-center items-center border-2 border-red-dark rounded-full"
                (click)="foodItemAdded(order._id)"
              >
                <ng-icon name="matAddOutline"></ng-icon>
              </button>
            </div>
            <div class="font-display text-2xl">{{ order.name }}</div>
            <div class="flex-1 text-right">{{ 'x $' + order.price }}</div>
          </div>
        </div>
      }
      @if(hasOrders) {
        <div class="text-right">
          <div class="p-4">Subtotal: {{ '$' + subtotal}}</div>
          <!-- <div>Sales Tax (7.25%): {{salesTax}}</div> -->
          <!-- <div>Total ($/USD): {{total}}</div> -->
          <button class="mt-2 px-6 py-2 font-sans font-bold uppercase rounded-full border border-red" (click)="submitOrder()">Checkout</button>
        </div>
      } @else {
        <div class="mt-10 text-center">
          <ng-icon name="matSentimentDissatisfiedOutline" size="120"></ng-icon>
          <p>Oh no! Your bag is empty. <a class="underline text-red-dark hover:text-red" routerLink="/menu">Visit our menu to start your order.</a></p>
        </div>
      }
    </div>
  `,
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  salesTaxPercent: number;
  foodItems$: Observable<FoodItem[]>;
  order$?: Observable<OrderItem[]>;
  quantity$?: Observable<number>;
  subtotal: number;
  total: string;
  salesTax: string;
  subtotalSub$: Subscription | undefined;
  cld: Cloudinary;
  hasOrders: boolean = false;

  constructor(private store: Store<AppState>) {
    this.foodItems$ = this.store.select(state => state.foodItems.foodItems);
    this.order$ = this.store.select(selectTransformedOrder);
    this.quantity$ = this.store.select(selectOrderTotalQuantity);
    this.salesTaxPercent = 0.0725;
    this.salesTax = '0';
    this.subtotal = 0;
    this.total = '0';
    this.cld = new Cloudinary({ cloud: { cloudName: environment.cloudName } });
    this.order$.subscribe(items => (this.hasOrders = (0 < items.length)));
  }

  ngOnInit() {
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
  
  foodItemAdded(foodItemID: string) {
    this.store.dispatch(FoodItemActions.foodItemAdded({foodItemID}));
  }
  
  foodItemRemoved(foodItemID: string) {
    this.store.dispatch(FoodItemActions.foodItemRemoved({foodItemID}));
  }

  getCloudinaryImage(imagePath: string): string {
    const img = this.cld.image('veganfood/' + imagePath);
    img.resize(fill().width(64).height(64));
    return img.toURL();
  }

  submitOrder() {
    this.order$?.pipe(take(1)).subscribe(orderItems => {
      const items = orderItems.map(item => ({
        _id: item._id,
        quantity: item.quantity
      }));
      
      fetch(`${environment.apiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items)
      }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json));
      }).then(({ url }) => {
        window.location = url;
      }).catch(e => {
        console.log(e.error)
      });
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
