import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IRestaurants,
  IRequete,
  IResultReview,
  IReview,
} from '../interface/restaurants';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  private latitude = 48.373347;
  private longitude = 2.816429;
  public nameRestaurant: string;
  private dataRestaurant: IRestaurants[];
  private listRestaurantJSONFiltre: IRestaurants[] = [];
  public placeID: string;
  public latMin: number;
  public latMax: number;
  public lngMin: number;
  public lngMax: number;

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
  @Output() imageSource: EventEmitter<string> = new EventEmitter();

  private APIKey = '&key=AIzaSyA4u_brprhE8n3YbdKkVG4FWgcFIzJ9j-U';
  private JSONFile = 'http://localhost:4200/assets/data/restaurants.JSON';
  private googAPI = 'https://maps.googleapis.com/maps/api/place/';
  private nearbySearch: string = this.googAPI + 'nearbysearch/json?location=';
  private nearbySearchEnd: string =
    '&radius=2000&type=restaurant' + this.APIKey;
  private reviewSearch = this.googAPI + 'details/json?placeid=';
  private reviewSearchEnd = '&fields=review,name' + this.APIKey;
  private streetView =
    'https://maps.googleapis.com/maps/api/streetview?size=400x200&location=';
  private streetEnd = '&heading=180&pitch=10&fov=110' + this.APIKey;
  private proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  constructor(private http: HttpClient) {}

  setPosition(lat: number, lng: number): void {
    this.latitude = lat;
    this.longitude = lng;
    this.lat.emit(this.latitude);
    this.lng.emit(this.longitude);
    this.getGoogRestaurant();
  }

  setClickLatLng(lat: number, lng: number): void {
    this.latClick.emit(lat);
    this.lngClick.emit(lng);
  }

  setImageSource(lat: number, lng: number): void {
    const source = this.streetView + lat + ',' + lng + this.streetEnd;
    this.imageSource.emit(source);
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

  getJSONRestaurant(
    latMin = this.latMin,
    latMax = this.latMax,
    lngMin = this.lngMin,
    lngMax = this.lngMax
  ) {
    this.latMin = latMin;
    this.latMax = latMax;
    this.lngMin = lngMin;
    this.lngMax = lngMax;
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
      this.nameRestaurant = restaurant.name;
    } else {
      const googReview = this.http.get<IResultReview>(
        this.proxyUrl + this.reviewSearch + placeID + this.reviewSearchEnd
      );
      googReview.subscribe((dataReviews) => {
        this.reviews.emit(dataReviews.result.reviews);
        this.nameRestaurantReview.emit(dataReviews.result.name);
        this.nameRestaurant = dataReviews.result.name;
      });
    }
    this.placeID = placeID;
  }

  getStreetView(lat: number, lng: number): string {
    const imgResto =
      this.proxyUrl + this.streetView + lat + ',' + lng + this.streetEnd;
    return imgResto;
  }

  putRestaurant(restaurant: IRestaurants): void {
    this.dataRestaurant.push(restaurant);
    this.restaurantJSONFull.emit(this.dataRestaurant);
    this.getJSONRestaurant();
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
    if (!this.dataRestaurant[id].ratings) {
      return;
    }
    let finalRating = 0;
    this.dataRestaurant[id].ratings.forEach((feedback) => {
      finalRating += feedback.rating;
    });
    finalRating = finalRating / this.dataRestaurant[id].ratings.length;
    finalRating = Math.round(finalRating * 10) / 10;
    this.dataRestaurant[id].rating = finalRating;
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
  }
}
