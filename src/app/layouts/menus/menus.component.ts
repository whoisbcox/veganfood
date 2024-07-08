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
