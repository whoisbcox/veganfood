import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenusComponent } from './menus/menus.component';
import { OrderComponent } from './order/order.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'menu',
    component: MenusComponent,
    title: 'Menus Page' 
  },
  {
    path: 'order',
    component: OrderComponent,
    title: 'Order Page' 
  }
];
