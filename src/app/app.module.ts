import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListRestaurantComponent } from './components/list-restaurant/list-restaurant.component';
import { RestaurantsService } from './services/restaurants.service';
import { HttpClientModule } from '@angular/common/http';
import { MapsComponent } from './components/maps/maps.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { FormsModule } from '@angular/forms';
import { ImageStreetComponent } from './components/image-street/image-street.component';

@NgModule({
  declarations: [
    AppComponent,
    ListRestaurantComponent,
    MapsComponent,
    FeedbacksComponent,
    AddRestaurantComponent,
    AddCommentComponent,
    ImageStreetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule,
    FormsModule,
  ],
  providers: [RestaurantsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
