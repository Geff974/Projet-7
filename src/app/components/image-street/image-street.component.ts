import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-image-street',
  templateUrl: './image-street.component.html',
  styleUrls: ['./image-street.component.scss'],
})
export class ImageStreetComponent implements OnInit {
  public imageSource: string;

  constructor(private restaurantService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantService.imageSource.subscribe(
      (data) => (this.imageSource = data)
    );
  }
}
