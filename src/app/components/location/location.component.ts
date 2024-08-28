import { Component, Input } from '@angular/core';
import { Location } from '../../models/location';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [],
  template: `
    <div class="text-center">
      <h3 class="font-display text-2xl lg:text-4xl">{{location.name}}</h3>
      <h4 class="font-serif text-xl lg:text-2xl">{{location.address}}</h4>
      <p>Hours: {{location.openTime}} &ndash; {{location.closeTime}}</p>
    </div>
  `,
  styleUrl: './location.component.css'
})
export class LocationComponent {
  @Input() location!: Location;
}
