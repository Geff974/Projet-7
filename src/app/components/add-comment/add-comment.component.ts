import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { IReview } from 'src/app/interface/restaurants';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  public name: string;
  public rating = 0;
  public comment: string;
  public nameRestaurant: string;

  constructor(private restaurantService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantService.nameRestaurantReview.subscribe((nameResto) => {
      this.nameRestaurant = nameResto;
    });
    this.checkNameReady();
  }

  addComment(): void {
    if (this.restaurantService.placeID) {
      const feedback: IReview = {
        author_name: this.name,
        rating: this.rating,
        text: this.comment,
        time: Date.now(),
      };
      this.restaurantService.putRating(feedback);
    } else {
      alert('Veuillez cliquer sur un restaurant');
    }
  }

  checkNameReady(): void {
    if (this.restaurantService.nameRestaurant) {
      this.nameRestaurant = this.restaurantService.nameRestaurant;
    }
  }

  rate(val): void {
    this.rating = parseInt(val, 10);
  }
}
