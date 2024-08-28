import { Component, Inject, OnInit, HostListener, PLATFORM_ID } from '@angular/core';
import { AsyncPipe, isPlatformBrowser, NgClass} from "@angular/common";
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FoodItemApiActions } from './store/actions/food-item.actions';
import { selectOrderTotalQuantity } from './store/selectors/order.selectors';
import { AppState } from './models/app.state';
import { HomeComponent } from './layouts/home/home.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matTakeoutDiningOutline, matMenuOutline } from '@ng-icons/material-icons/outline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, HomeComponent, NgClass, NgIconComponent, RouterLink, RouterOutlet],
  providers: [provideIcons({matMenuOutline, matTakeoutDiningOutline})],
  template: `
    <main class="pt-[72px]">
    <header class="flex fixed justify-between md:items-center top-0 left-0 right-0 z-10 p-4 bg-deep-blue text-off-white">
      <h1 class="font-display text-4xl text-white"><a routerLink="/">{{title}}<sup class="relative -top-4 font-sans font-light text-sm">&trade;</sup></a></h1>
      <button class="md:hidden flex flex-col justify-center items-center hover:text-yellow-light transition-color" aria-label="Toggle Main Navigation Menu" (click)="toggleNavigation()"><ng-icon name="matMenuOutline" size="36px"></ng-icon></button>
      <nav [ngClass]="navOpen && innerWidth < 768 ? 'block' : 'hidden'" class="py-4 md:py-0 absolute md:relative top-full md:top-auto right-2 md:right-auto bg-deep-blue md:bg-transparent md:flex rounded-bl-md rounded-br-md md:rounded-0" aria-label="Main Navigation Menu">
        <ul class="md:flex">
          <li class="content-center"><a class="px-6 md:px-4 py-2 block" routerLink="/menu">Menu</a></li>
          <li class="content-center"><a class="px-6 md:px-4 py-2 block" href="/#locations">Locations</a></li>
          <li class="px-5 md:pr-0 py-2 md:py-0">
            <a class="px-6 py-2 inline-flex items-center rounded-full bg-yellow-light text-deep-blue" routerLink="/order">
              Order&ensp;<ng-icon name="matTakeoutDiningOutline" size="24px"></ng-icon> {{quantity$ | async}}
            </a>
          </li>
        </ul>
      </nav>
    </header>
    <section class="content">
      <router-outlet />
    </section>
  </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Lotus Garden';
  quantity$?: Observable<number>;
  navOpen: boolean = false;
  innerWidth: any;

  constructor(private store: Store<AppState>, @Inject(PLATFORM_ID) private platformId: Object) {
    this.quantity$ = this.store.select(selectOrderTotalQuantity);
  }

  ngOnInit() {
    this.store.dispatch(FoodItemApiActions.loadFoodItems());
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth = window.innerWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  toggleNavigation() {
    this.navOpen = !this.navOpen;
  }
}
