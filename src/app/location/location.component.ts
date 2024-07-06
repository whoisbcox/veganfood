import { Component, Input } from '@angular/core';
import { Location } from '../location';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [],
  template: `
    <div>
      <h3>{{location.name}}</h3>
      <h4>{{location.address}}</h4>
      <p>Hours: {{location.openTime}} &ndash; {{location.closeTime}}</p>
    </div>
  `,
  styleUrl: './location.component.css'
})
export class LocationComponent {
  @Input() location!: Location;
}
