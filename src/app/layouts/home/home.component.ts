import { Component, OnInit, inject } from '@angular/core';
import { FoodItemComponent } from '../../components/food-item/food-item.component';
import { LocationComponent } from '../../components/location/location.component';
import { FoodItem } from '../../models/food-item';
import { Location } from '../../models/location';
import { FoodService } from '../../services/food.service';
import { LocationService } from '../../services/location.service';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill, scale } from "@cloudinary/url-gen/actions/resize";
import { environment } from '../../../environments/environment';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FoodItemComponent, LocationComponent, CloudinaryModule],
  template: `
    <section>
      <advanced-image [cldImg]="heroImg"></advanced-image>
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
      <advanced-image [cldImg]="locationImg"></advanced-image>
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
  featuredIds: string[] = [];
  locations: Location[] = [];
  foodService: FoodService = inject(FoodService);
  locationService: LocationService = inject(LocationService);
  heroImg!: CloudinaryImage;
  locationImg!: CloudinaryImage;

  constructor() {
    this.locations = this.locationService.getAllLocations();
    this.featuredIds = [ 
      '669d875371af99936b1a5f89',
      '669d875371af99936b1a5f8e',
      '669d875371af99936b1a5f8f',
      '669d875371af99936b1a5f97'
    ];    
  }

  ngOnInit(): void {
    const cld = new Cloudinary({ cloud: { cloudName: environment.cloudName } });
    
    this.heroImg = cld.image('veganfood/ejs5nk3j6abpi7kgzf1n');
    this.heroImg.resize(fill().width(2400).height(1600))
      .delivery(quality(auto()))
      .delivery(format(auto()));
    
    this.locationImg = cld.image('veganfood/hbbk3fb2iqf4c1jtpct9');
    this.locationImg.resize(fill().width(2400).height(1600))
      .delivery(quality(auto()))
      .delivery(format(auto()));

    this.foodService.getFoodItemsByIds(this.featuredIds).subscribe(
      (items: FoodItem[]) => {
        this.featuredItemList = items;
      },
      (error: any) => {
        console.error('Error fetching food items', error);
      }
    );
  }
}
