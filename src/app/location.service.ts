import { Injectable } from '@angular/core';
import { Location } from '../app/location';
import locations from '../app/db/locations.json';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  protected locationsList: Location[] = locations;

  constructor() { }

  getAllLocations(): Location[] {
    return this.locationsList;
  }
}
