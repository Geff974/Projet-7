export interface IRestaurants {
  id: number;
  name: string;
  address: string;
  geometry: { location: { lat: number; lng: number } };
  ratings: IReview[];
  rating: number;
  place_id: string;
}

export interface IResult {
  geometry: { location: { lat: number; lng: number } };
  id: string;
  name: string;
  rating: number;
  place_id: string;
}

export interface IRequete {
  html_attributions: Array<string>;
  results: Array<IResult>;
  status: string;
}

export interface IReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

export interface IResultReview {
  html_attributions: Array<string>;
  result: { name: string; reviews: IReview[] };
  status: string;
}
