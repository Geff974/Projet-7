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
  public rating: number = 0;
  public comment: string;

  constructor(private restaurantService: RestaurantsService) {}

  ngOnInit(): void {}

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

  rate(val): void {
    this.rating = parseInt(val, 10);
  }
}
