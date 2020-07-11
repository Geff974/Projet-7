import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { IRestaurants } from 'src/app/interface/restaurants';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
})
export class AddRestaurantComponent implements OnInit {
  public Longitude: number;
  public Latitude: number;
  public restaurantToAdd: IRestaurants = {
    id: 0,
    name: '',
    address: '',
    geometry: { location: { lat: this.Latitude, lng: this.Longitude } },
    ratings: [],
    rating: 0,
    place_id: '',
  };
  public address: string;
  public name = 'test';

  constructor(private restaurantService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantService.latClick.subscribe((data: number) => {
      this.Latitude = data;
      this.restaurantToAdd.geometry.location.lat = data;
    });
    this.restaurantService.lngClick.subscribe((data: number) => {
      this.Longitude = data;
      this.restaurantToAdd.geometry.location.lng = data;
    });
  }

  addRest(): void {
    const JSONRestaurant = this.restaurantService.getJSONRestaurantFull();
    const idRestaurant = JSONRestaurant.length + 1;
    const restaurantSend: IRestaurants = {
      id: idRestaurant,
      name: this.restaurantToAdd.name,
      address: this.restaurantToAdd.address,
      geometry: { location: { lat: this.Latitude, lng: this.Longitude } },
      rating: 0,
      ratings: [],
      place_id: 'placeID' + idRestaurant,
    };
    this.restaurantService.putRestaurant(restaurantSend);
  }
}
