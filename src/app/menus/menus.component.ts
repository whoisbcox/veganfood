import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from '../food.service';
import { FoodItem } from '../food-item';
import { FoodItemComponent } from '../food-item/food-item.component';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [FoodItemComponent],
  template: `
    <section>
      <h2>Brunch</h2>
      @for(brunchItem of brunchItemList; track brunchItem.id) {
        <app-food-item [foodItem]="brunchItem"></app-food-item>
      }
    </section>
    <section>
      <h2>Dinner</h2>
      @for(dinnerItem of dinnerItemList; track dinnerItem.id) {
        <app-food-item [foodItem]="dinnerItem"></app-food-item>
      }
    </section>
    <section>
      <h2>Drinks</h2>
      @for(drinksItem of drinksItemList; track drinksItem.id) {
        <app-food-item [foodItem]="drinksItem"></app-food-item>
      }
    </section>
  `,
  styleUrl: './menus.component.css'
})
export class MenusComponent {
  brunchItemList: FoodItem[] = [];
  dinnerItemList: FoodItem[] = [];
  drinksItemList: FoodItem[] = [];
  foodService: FoodService = inject(FoodService);

  constructor() {
    this.brunchItemList = this.foodService.getFoodItemsByType('brunch');
    this.dinnerItemList = this.foodService.getFoodItemsByType('dinner');
    this.drinksItemList = this.foodService.getFoodItemsByType('drinks');
  }
}
