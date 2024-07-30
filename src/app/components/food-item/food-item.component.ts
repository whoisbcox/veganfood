import { Component, Input, inject } from '@angular/core';
import { FoodItem } from '../../models/food-item';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FoodItemActions } from '../../store/actions/order.actions';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from "@cloudinary/url-gen/actions/resize";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-food-item',
  standalone: true,
  imports: [CloudinaryModule],
  template: `
    <div class="food-item">
      <advanced-image class="food-item__img" [cldImg]="img"></advanced-image>
      <h2 class="food-item__title">{{foodItem.name}}</h2>
      <p class="food-item__desc">{{foodItem.description}}</p>
      <p class="food-item__price">{{foodItem.price}}</p>
      <button (click)="foodItemAdded(foodItem._id)">Add to Order</button>
    </div>
  `,
  styleUrl: './food-item.component.css'
})
export class FoodItemComponent {
  @Input() foodItem!: FoodItem;
  private store = inject(Store);
  order$?: Observable<object>;
  title = 'veganfood';
  img!: CloudinaryImage;
  
  constructor() {
    this.order$ = this.store.select('order');
  }
  
  ngOnInit() {
    const cld = new Cloudinary({ cloud: { cloudName: environment.cloudName } });
    this.img = cld.image('veganfood/' + this.foodItem.image);
    this.img.resize(fill().width(250).height(250));
  }

  foodItemAdded(foodItemID: string) {
    this.store.dispatch(FoodItemActions.foodItemAdded({foodItemID}));
  }
  
  foodItemRemoved(foodItemID: string) {
    this.store.dispatch(FoodItemActions.foodItemRemoved({foodItemID}));
  }
}
