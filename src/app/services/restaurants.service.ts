import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IRestaurants,
  IRequete,
  IResultReview,
  IReview,
} from '../interface/restaurants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  private latitude: number = 48.373347;
  private longitude: number = 2.816429;
  private dataRestaurant: IRestaurants[];
  private listRestaurantJSONFiltre: IRestaurants[] = [];
  public placeID: string;

  @Output() lat: EventEmitter<number> = new EventEmitter();
  @Output() lng: EventEmitter<number> = new EventEmitter();
  @Output() latClick: EventEmitter<number> = new EventEmitter();
  @Output() lngClick: EventEmitter<number> = new EventEmitter();
  @Output() listRestaurant: EventEmitter<IRequete> = new EventEmitter();
  @Output() reviews: EventEmitter<IReview[]> = new EventEmitter();
  @Output() nameRestaurantReview: EventEmitter<string> = new EventEmitter();
  @Output() restaurantJSON: EventEmitter<IRestaurants[]> = new EventEmitter();
  @Output() restaurantJSONFull: EventEmitter<
    IRestaurants[]
  > = new EventEmitter();

  private APIKey = '&key=AIzaSyA4u_brprhE8n3YbdKkVG4FWgcFIzJ9j-U';
  private JSONFile: string =
    'http://localhost:4200/assets/data/restaurants.JSON';
  private googAPI = 'https://maps.googleapis.com/maps/api/place/';
  private nearbySearch: string = this.googAPI + 'nearbysearch/json?location=';
  private nearbySearchEnd: string =
    '&radius=2000&type=restaurant' + this.APIKey;
  private reviewSearch = this.googAPI + 'details/json?placeid=';
  private reviewSearchEnd = '&fields=review,name' + this.APIKey;
  private streetView =
    'https://maps.googleapis.com/maps/api/streetview?size=80x80&location=';
  private streetEnd = '&fov=80&heading=70&pitch=0' + this.APIKey;
  private proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  constructor(private http: HttpClient) {}

  setPosition(lat: number, lng: number): void {
    this.latitude = lat;
    this.longitude = lng;
    this.lat.emit(this.latitude);
    this.lng.emit(this.longitude);
    this.getGoogRestaurant();
  }

  setClickLatLng(lat: number, lng: number) {
    this.latClick.emit(lat);
    this.lngClick.emit(lng);
  }

  getGoogRestaurant(): void {
    const googRestaurant = this.http.get<IRequete>(
      this.proxyUrl +
        this.nearbySearch +
        this.latitude +
        ',' +
        this.longitude +
        this.nearbySearchEnd
    );
    googRestaurant.subscribe((data) => this.listRestaurant.emit(data));
  }

  getJSONRestaurantFull(): IRestaurants[] {
    return this.dataRestaurant;
  }

  getJSONRestaurant(latMin, latMax, lngMin, lngMax) {
    this.listRestaurantJSONFiltre = [];
    this.dataRestaurant.forEach((element) => {
      const lat = element.geometry.location.lat;
      const lng = element.geometry.location.lng;
      if (lat > latMin && lat < latMax) {
        if (lng > lngMin && lng < lngMax) {
          this.listRestaurantJSONFiltre.push(element);
        }
      }
    });
    this.restaurantJSON.emit(this.listRestaurantJSONFiltre);
  }

  getGoogReviews(placeID: string): void {
    if (placeID.includes('placeID')) {
      const restaurant = this.dataRestaurant.find(
        (resto) => resto.place_id === placeID
      );
      this.reviews.emit(restaurant.ratings);
      this.nameRestaurantReview.emit(restaurant.name);
    } else {
      const googReview = this.http.get<IResultReview>(
        this.proxyUrl + this.reviewSearch + placeID + this.reviewSearchEnd
      );
      googReview.subscribe((dataReviews) => {
        this.reviews.emit(dataReviews.result.reviews);
        this.nameRestaurantReview.emit(dataReviews.result.name);
      });
    }
    this.placeID = placeID;
  }

  getStreetView(lat: number, lng: number): Observable<object> {
    const imgResto = this.http.get(
      this.proxyUrl + this.streetView + lat + ',' + lng + this.streetEnd
    );
    return imgResto;
  }

  putRestaurant(restaurant: IRestaurants): void {
    this.dataRestaurant.push(restaurant);
    this.dataRestaurant.forEach((item: IRestaurants) => {
      console.log(item);
    });
    this.loadDataRestaurant();
  }

  putRating(rating: IReview): void {
    if (this.placeID.includes('placeID')) {
      const restaurant = this.dataRestaurant.find(
        (resto) => resto.place_id === this.placeID
      );
      const id = restaurant.id - 1;
      this.dataRestaurant[id].ratings.push(rating);
      this.updateRating(id);
    } else {
      alert(
        "Impossible pour le moment d'ajouter un commentaire a ce restaurant"
      );
    }
  }

  updateRating(id): void {
    let finalRating = 0;
    this.dataRestaurant[id].ratings.forEach((feedback) => {
      finalRating += feedback.rating;
    });
    finalRating = finalRating / this.dataRestaurant[id].ratings.length;
    this.dataRestaurant[id].rating = finalRating;
  }

  showDataRestaurant(): void {
    console.log(this.dataRestaurant);
  }

  loadDataRestaurant(): void {
    this.http
      .get<IRestaurants[]>(this.JSONFile)
      .toPromise()
      .then((data) => {
        this.dataRestaurant = data;
        this.dataRestaurant.forEach((resto) => this.updateRating(resto.id - 1));
      });
    this.restaurantJSONFull.emit(this.dataRestaurant);
    console.log(this.dataRestaurant);
  }
}
