import { Component } from '@angular/core';
import { OrderSummaryComponent } from "../../components/order-summary/order-summary.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { faBrandCcAmex, faBrandCcDiscover, faBrandGooglePay, faBrandCcJcb, faBrandCcDinersClub, faBrandCcMastercard, faBrandCcStripe, faBrandCcVisa } from '@ng-icons/font-awesome/brands';
import { Observable } from 'rxjs';
import { OrderItem } from '../../models/order-item';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app.state';
import { selectTransformedOrder } from '../../store/selectors/order.selectors';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgIconComponent, OrderSummaryComponent],
  providers: [provideIcons({ faBrandCcAmex, faBrandCcDiscover, faBrandGooglePay, faBrandCcJcb, faBrandCcDinersClub, faBrandCcMastercard, faBrandCcStripe, faBrandCcVisa })],
  template: `
    <div class="mt-20 px-4">
      <app-order-summary></app-order-summary>
      @if (hasOrders) {
        <h3 class="mt-12 mb-4 font-sans text-lg md:text-xl lg:text-lg text-center">We accept the following forms of payments</h3>
        <ul class="payment-types flex flex-wrap justify-center gap-4">
          <li class="payment-type__googlepay">
            <a class="w-[48px] h-[38px] flex flex-col justify-center translate-y-[4px] items-center bg-black rounded-[5px]" href="#"><ng-icon name="faBrandGooglePay" size="36px" color="white"></ng-icon></a>
          </li>
          <li class="payment-type__visa">
            <a href="#"><ng-icon name="faBrandCcVisa" size="48px"></ng-icon></a>
          </li>
          <li class="payment-type__mastercard">
            <a href="#"><ng-icon name="faBrandCcMastercard" size="48px"></ng-icon></a>
          </li>
          <li class="payment-type__amex">
            <a href="#"><ng-icon name="faBrandCcAmex" size="48px"></ng-icon></a>
          </li>
          <li class="payment-type__discover">
            <a href="#"><ng-icon name="faBrandCcDiscover" size="48px"></ng-icon></a>
          </li>
          <li class="payment-type__stripe">
            <a href="#"><ng-icon name="faBrandCcStripe" size="48px"></ng-icon></a>
          </li>
          <li class="payment-type__jcb">
            <a href="#"><ng-icon name="faBrandCcJcb" size="48px"></ng-icon></a>
          </li>
          <li class="payment-type__diner">
            <a href="#"><ng-icon name="faBrandCcDinersClub" size="48px"></ng-icon></a>
          </li>
        </ul>
      }
    </div>
  `,
  styleUrl: './order.component.css'
})
export class OrderComponent {
  order$: Observable<OrderItem[]>;
  hasOrders: boolean = false;
  
  constructor(private store: Store<AppState>) {
    this.order$ = this.store.select(selectTransformedOrder);
    this.order$.subscribe(items => (this.hasOrders = (0 < items.length))); 
  }
}
