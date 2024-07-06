import { Component, Input } from '@angular/core';
import { FoodItem } from '../food-item';

@Component({
  selector: 'app-food-item',
  standalone: true,
  imports: [],
  template: `
    <div class="food-item">
      <img class="food-item__img" src="" alt="Photo of {{foodItem.name}}">
      <h2 class="food-item__title">{{foodItem.name}}</h2>
      <p class="food-item__desc">{{foodItem.description}}</p>
      <p class="food-item__price">{{foodItem.price}}</p>
    </div>
  `,
  styleUrl: './food-item.component.css'
})
export class FoodItemComponent {
  @Input() foodItem!: FoodItem;
}
