import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { IReview } from 'src/app/interface/restaurants';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent implements OnInit {
  public reviews: IReview[];
  public nameRestaurant: string;

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.checkAlreadyInit();
    this.restaurantsService.reviews.subscribe((dataReviews) => {
      this.reviews = dataReviews;
      console.log('entrer dans la boucle');
    });
    this.restaurantsService.nameRestaurantReview.subscribe(
      (nameRest) => (this.nameRestaurant = nameRest)
    );
  }

  checkAlreadyInit(): void {
    const placeID = this.restaurantsService.placeID;
    if (placeID) {
      this.restaurantsService.getGoogReviews(placeID);
    }
  }
}
