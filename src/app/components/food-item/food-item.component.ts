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
    <div class="flex overflow-hidden rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-yellow">
      <div class="basis-2/5">
        <advanced-image class="food-item__img object-cover" [cldImg]="img"></advanced-image>
      </div>
      <div class="basis-3/5 p-4">
        <div class="flex justify-between items-baseline">
          <h2 class="food-item__title font-display text-2xl text-off-white">{{foodItem.name}}</h2>
          <p class="food-item__price font-display text-xl">{{'$' + foodItem.price}}</p>
        </div>
        <p class="food-item__desc mt-2 text-sm">{{foodItem.description}}</p>
        <button class="mt-2 px-6 py-2 font-sans font-bold uppercase rounded-full border border-red text-off-white" (click)="foodItemAdded(foodItem._id)">Add to Order</button>
      </div>
    </div>
  `,
  styleUrl: './food-item.component.css'
})
export class FoodItemComponent {
  @Input() foodItem!: FoodItem;
  private store = inject(Store);
  order$?: Observable<object>;
  img!: CloudinaryImage;
  
  constructor() {
    this.order$ = this.store.select('order');
  }
  
  ngOnInit() {
    const cld = new Cloudinary({ cloud: { cloudName: environment.cloudName } });
    this.img = cld.image('veganfood/' + this.foodItem.image);
    this.img.resize(fill().width(300).height(300));
  }

  foodItemAdded(foodItemID: string) {
    this.store.dispatch(FoodItemActions.foodItemAdded({foodItemID}));
  }
  
  foodItemRemoved(foodItemID: string) {
    this.store.dispatch(FoodItemActions.foodItemRemoved({foodItemID}));
  }
}
