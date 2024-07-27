import { Component, OnInit, inject } from '@angular/core';
import { FoodItemComponent } from '../../components/food-item/food-item.component';
import { LocationComponent } from '../../components/location/location.component';
import { FoodItem } from '../../models/food-item';
import { Location } from '../../models/location';
import { FoodService } from '../../services/food.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FoodItemComponent, LocationComponent],
  template: `
    <section>
      <h1>Headline</h1>
      <p>Description text</p>
      <a href="">Order Now</a>
    </section>
    <section class="results">
      <h2>Featured Items</h2>
      @for (featuredItem of featuredItemList; track featuredItem._id) {
        <app-food-item [foodItem]="featuredItem"></app-food-item>
      }
      <ul class="payment-types">
        <li class="payment-type__applepay"><a href="#"></a></li>
        <li class="payment-type__visa"><a href="#"></a></li>
        <li class="payment-type__mastercard"><a href="#"></a></li>
        <li class="payment-type__amex"><a href="#"></a></li>
        <li class="payment-type__discover"><a href="#"></a></li>
      </ul>
    </section>
    <section>
      <h2>Locations</h2>
      @for (location of locations; track location.id) {
        <app-location [location]="location"></app-location>
      }
    <section>
    <section>
      <h2>Save Money With Our Rewards Program</h2>
      <form>
        <input type="email" name="email" placeholder="Enter your email address" />
        <button type="submit">Sign Up</button>
      </form>
      <ul class="social-links">
        <li class="social-link__instagram"><a href="#"></a></li>
        <li class="social-link__twitter-x"><a href="#"></a></li>
        <li class="social-link__facebook"><a href="#"></a></li>
        <li class="social-link__youtube"><a href="#"></a></li>
        <li class="social-link__tiktok"><a href="#"></a></li>
        <li class="social-link__linkedin"><a href="#"></a></li>
      </ul>
    </section>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredItemList: FoodItem[] = [];
  locations: Location[] = [];
  foodService: FoodService = inject(FoodService);
  locationService: LocationService = inject(LocationService);

  constructor() {
    // this.featuredItemList = this.foodService.getFoodItemsByIds([1, 6, 7, 15]);
    this.locations = this.locationService.getAllLocations();    
  }

  ngOnInit(): void {
    this.foodService.getFoodItemsByIds([
      '669d875371af99936b1a5f89',
      '669d875371af99936b1a5f8e',
      '669d875371af99936b1a5f8f',
      '669d875371af99936b1a5f97']).subscribe(
      (items: FoodItem[]) => {
        this.featuredItemList = items;
      },
      (error: any) => {
        console.error('Error fetching food items', error);
      }
    );
  }
}
