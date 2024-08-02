import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { FoodItem } from '../../models/food-item';
import { FoodItemComponent } from '../../components/food-item/food-item.component';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [FoodItemComponent],
  template: `
    <section class="">
      <div class="container mx-auto py-16">
        <h2 class="mb-12 font-display text-7xl text-green text-center">Brunch</h2>
        <div class="grid grid-cols-2 gap-12">
          @for(brunchItem of brunchItemList; track brunchItem._id) {
            <app-food-item [foodItem]="brunchItem"></app-food-item>
          }
        </div>
      </div>
    </section>
    <section class="bg-red-dark">
      <div class="container mx-auto py-16">
        <h2 class="mb-12 font-display text-7xl text-yellow-light text-center">Dinner</h2>
        <div class="grid grid-cols-2 gap-12">
          @for(dinnerItem of dinnerItemList; track dinnerItem._id) {
            <app-food-item [foodItem]="dinnerItem"></app-food-item>
          }
        </div>
      </div>
    </section>
    <section class="bg-deep-blue">
      <div class="container mx-auto py-16">
        <h2 class="mb-12 font-display text-7xl text-green text-center">Drinks</h2>
        <div class="grid grid-cols-2 gap-12">
          @for(drinksItem of drinksItemList; track drinksItem._id) {
            <app-food-item [foodItem]="drinksItem"></app-food-item>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './menus.component.css'
})
export class MenusComponent implements OnInit {
  brunchItemList: FoodItem[] = [];
  dinnerItemList: FoodItem[] = [];
  drinksItemList: FoodItem[] = [];
  foodService: FoodService = inject(FoodService);

  constructor() {}

  ngOnInit(): void {
    this.fetchFoodItemsByType('brunch', items => this.brunchItemList = items);
    this.fetchFoodItemsByType('dinner', items => this.dinnerItemList = items);
    this.fetchFoodItemsByType('drinks', items => this.drinksItemList = items);
  }

  fetchFoodItemsByType(type: string, callback: (items: FoodItem[]) => void): void {
    this.foodService.getFoodItemsByType(type).subscribe(
      (items: FoodItem[]) => {
        callback(items);
      },
      (error: any) => {
        console.error(`Error fetching ${type} items`, error);
      }
    );
  }
}
