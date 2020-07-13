import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { IRestaurants, IRequete } from 'src/app/interface/restaurants';

@Component({
  selector: 'app-list-restaurant',
  templateUrl: './list-restaurant.component.html',
  styleUrls: ['./list-restaurant.component.scss'],
})
export class ListRestaurantComponent implements OnInit {
  public listRestaurantTOTAL = [];
  public listRestaurantJSON: IRestaurants[];
  public listRestaurantFilter: IRestaurants[];
  public listRestaurant: IRequete = {
    html_attributions: [],
    results: [],
    status: 'ok',
  };
  public minRating = 0;
  public maxRating = 5;
  public restaurantName: string;

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantsService.listRestaurant.subscribe((data) => {
      this.listRestaurant = data;
      this.loadRestaurantTotal();
    });
    this.restaurantsService.restaurantJSON.subscribe((data) => {
      this.listRestaurantJSON = data;
      this.loadRestaurantTotal();
    });
    this.restaurantsService.getGoogRestaurant();
    this.restaurantsService.loadDataRestaurant();
  }

  loadRestaurantTotal() {
    if (!this.listRestaurantJSON) {
      return;
    }
    this.listRestaurantTOTAL = [];
    this.listRestaurantJSON.forEach((element) => {
      this.listRestaurantTOTAL.push(element);
    });
    this.listRestaurant.results.forEach((element) => {
      this.listRestaurantTOTAL.push(element);
    });
    this.filterRating();
  }

  showInMap(event: IRestaurants) {
    const latitude = event.geometry.location.lat;
    const longitude = event.geometry.location.lng;
    this.restaurantsService.setPosition(latitude, longitude);
    this.restaurantsService.setImageSource(latitude, longitude);
    this.restaurantsService.getGoogReviews(event.place_id);
  }

  filterRating(): void {
    this.listRestaurantFilter = [];
    this.listRestaurantTOTAL.forEach((resto) => {
      if (resto.rating >= this.minRating && resto.rating < this.maxRating) {
        this.listRestaurantFilter.push(resto);
      }
    });
  }

  test() {
    this.loadRestaurantTotal();
  }
}
