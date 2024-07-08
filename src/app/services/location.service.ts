import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import locations from '../db/locations.json';

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
