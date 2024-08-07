import { Component } from '@angular/core';
import { OrderSummaryComponent } from "../../components/order-summary/order-summary.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [OrderSummaryComponent],
  template: `
    <div class="mt-20">
      <app-order-summary></app-order-summary>
    </div>
  `,
  styleUrl: './order.component.css'
})
export class OrderComponent {

}
