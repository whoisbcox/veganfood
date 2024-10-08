import { Routes } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';
import { MenusComponent } from './layouts/menus/menus.component';
import { OrderComponent } from './layouts/order/order.component';
import { OrderStatusComponent } from './layouts/order-status/order-status.component';

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
  },
  {
    path: 'order-status',
    component: OrderStatusComponent,
    title: 'Order Status' 
  }
];
