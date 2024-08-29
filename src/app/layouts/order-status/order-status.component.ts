import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [],
  template: `
    <div class="mt-20 px-4">
      <div class="container max-w-screen-lg mx-auto">
        @if (success) {
          <h1 class="font-display text-4xl text-green text-center">Payment Successful!</h1>
          <p class="mt-2 text-center">{{ pickupRange }}</p>
        }
        @if (canceled) {
          <h1 class="font-display text-4xl text-green text-center">Payment Failed</h1>
          <p class="mt-2 text-center">There was a problem with your payment. Please try again.</p>
        }
        @if (!success && !canceled) {
          <h1 class="font-display text-4xl text-green text-center">Order Status</h1>
          <p class="mt-2 text-center">Check the payment status or try again.</p>
        }
      </div>
    </div>
  `,
  styleUrl: './order-status.component.css'
})
export class OrderStatusComponent implements OnInit {
  success: boolean = false;
  canceled: boolean = false;
  pickupRange: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.success = this.convertToBoolean(params['success']);
      this.canceled = this.convertToBoolean(params['canceled']);

      if (this.success) {
        const orderTime = params['orderTime'];
        if (orderTime) {
          this.calculatePickupRange(new Date(orderTime));
        }
      }
    });
  }

  private convertToBoolean(value: string | undefined): boolean {
    return value === 'true';
  }

  private formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  

  private calculatePickupRange(orderTime: Date): void {
    const minPickupTimeStr = this.formatTime(new Date(orderTime.getTime() + 20 * 60 * 1000)); // 20 minutes later
    const maxPickupTimeStr = this.formatTime(new Date(orderTime.getTime() + 40 * 60 * 1000)); // 40 minutes later

    this.pickupRange = `Your order will be ready for pickup between ${minPickupTimeStr} and ${maxPickupTimeStr}.`;
  }
}
