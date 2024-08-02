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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FoodItemComponent, LocationComponent, CloudinaryModule, RouterLink],
  template: `
    <section>
      <advanced-image [cldImg]="heroImg"></advanced-image>
      <div class="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center text-white">
        <h1 class="font-display text-9xl">Headline</h1>
        <p class="font-serif text-3xl">Description text</p>
        <a class="inline-block mt-6 px-10 py-3 font-sans font-bold uppercase rounded-full border-2 border-off-white text-off-white" routerLink="/menu">Order Now</a>
      </div>
    </section>
    <section class="container mx-auto pt-16 pb-28">
      <h2 class="mb-12 font-display text-7xl text-green text-center">Featured Items</h2>
      <div class="grid grid-cols-2 gap-16">
        @for (featuredItem of featuredItemList; track featuredItem._id) {
          <div class="">
            <app-food-item [foodItem]="featuredItem"></app-food-item>
          </div>
        }
      </div>
      <ul class="payment-types">
        <li class="payment-type__applepay"><a href="#"></a></li>
        <li class="payment-type__visa"><a href="#"></a></li>
        <li class="payment-type__mastercard"><a href="#"></a></li>
        <li class="payment-type__amex"><a href="#"></a></li>
        <li class="payment-type__discover"><a href="#"></a></li>
      </ul>
    </section>
    <section class="h-screen min-h-[650px] block relative">
      <advanced-image [cldImg]="locationImg" class="object-cover"></advanced-image>
      <div class="container mx-auto absolute inset-0 flex flex-col justify-center text-white">
        <h2 class="mb-12 font-display text-7xl text-white text-center">Locations</h2>
        <div class="grid grid-cols-2 gap-16">
          @for (location of locations; track location.id) {
            <app-location [location]="location"></app-location>
          }
        </div>
      </div>
    <section>
    <section class="pt-16 pb-28 bg-deep-blue text-off-white text-center">
      <h2 class="mb-12 font-display text-7xl text-yellow-light">Save Money With<br>Our Rewards Program</h2>
      <form class="mx-auto inline-flex">
        <input class="block min-w-64 pl-6 p-10 py-4 rounded-tl-full rounded-bl-full border border-yellow-light bg-transparent text-white placeholder:text-gray-400" type="email" name="email" placeholder="Enter your email address" />
        <button class="flex flex-col justify-center px-8 -translate-x-8 rounded-full bg-yellow-light text-deep-blue" type="submit">Sign Up</button>
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
