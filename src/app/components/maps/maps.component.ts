import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { IRequete, IRestaurants } from 'src/app/interface/restaurants';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit, DoCheck {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
  public infoContent = { name: '', address: '' };
  public latitude: number;
  public longitude: number;
  public userPosition: google.maps.LatLngLiteral;
  public zoom = 15;
  public center: google.maps.LatLngLiteral;
  private listRestaurantJSON: IRestaurants[];
  public listRestaurantFull = [];
  public options: google.maps.MapOptions = {
    maxZoom: 25,
    minZoom: 14,
  };

  public listRestaurant: IRequete = {
    html_attributions: [],
    results: [
      {
        geometry: { location: { lat: 0, lng: 0 } },
        id: '',
        name: '',
        rating: 0,
        place_id: '',
      },
    ],
    status: 'OK',
  };

  constructor(private restaurantsService: RestaurantsService) {}

  ngDoCheck(): void {
    try {
      this.addRestaurantJSON();
    } catch (e) {
      console.log(e);
    }
  }

  ngOnInit(): void {
    this.restaurantsService.lat.subscribe((lat: number) => {
      this.latitude = lat;
      this.updateCenter();
    });

    this.restaurantsService.restaurantJSON.subscribe((resto) => {
      this.listRestaurantJSON = resto;
      this.loadRestaurantFull();
    });

    this.restaurantsService.lng.subscribe((lng: number) => {
      this.longitude = lng;
      this.updateCenter();
    });

    this.restaurantsService.listRestaurant.subscribe((data) => {
      this.listRestaurant = data;
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.restaurantsService.setPosition(
          position.coords.latitude,
          position.coords.longitude
        );
        this.userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      },
      () => {
        alert(
          "Votre geolocation n'est pas active. Position par default chargée."
        );
        this.restaurantsService.setPosition(48.85837, 2.294481);
      }
    );
  }

  updateCenter(): void {
    this.center = {
      lat: this.latitude,
      lng: this.longitude,
    };
  }

  infoWind(marker: MapMarker, markerInfo) {
    this.restaurantsService.setImageSource(
      markerInfo.geometry.location.lat,
      markerInfo.geometry.location.lng
    );
    this.infoContent.name = markerInfo.name;
    this.infoContent.address = markerInfo.vicinity;
    this.info.open(marker);
    this.restaurantsService.getGoogReviews(markerInfo.place_id);
  }

  addRestaurantJSON() {
    const boundsMap = this.map.getBounds().toJSON();
    this.restaurantsService.getJSONRestaurant(
      boundsMap.south,
      boundsMap.north,
      boundsMap.west,
      boundsMap.east
    );
  }

  actualizeWhenDrag() {
    this.listRestaurantFull = [];
    this.restaurantsService.setPosition(
      this.map.getCenter().lat(),
      this.map.getCenter().lng()
    );
    this.addRestaurantJSON();
  }

  mapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.restaurantsService.setClickLatLng(lat, lng);
  }

  loadRestaurantFull(): void {
    if (!this.listRestaurantJSON) {
      return;
    }
    this.listRestaurantFull = [];
    this.listRestaurantJSON.forEach((resto) =>
      this.listRestaurantFull.push(resto)
    );
    this.listRestaurant.results.forEach((resto) =>
      this.listRestaurantFull.push(resto)
    );
  }
}
