import { Component } from '@angular/core';
import { FoodItemComponent } from '../food-item/food-item.component';
import { FoodItem } from '../food-item';
import fooditems from '../fooditems.json';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FoodItemComponent],
  template: `
    <section>
      <form>
        <select name="food-menu-type" id="food-menu-type">
          <option value="brunch">Brunch</option>
          <option value="dinner">Dinner</option>
          <option value="drink">Drinks</option>
        </select>
      </form>
    </section>
    <section class="results">
      @for (foodItem of foodItemList; track foodItem.id) {
        <app-food-item [foodItem]="foodItem"></app-food-item>
      }
    </section>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  foodItemList: FoodItem[] = fooditems;
}
