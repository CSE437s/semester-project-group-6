export type Participant = {
    imageURL: string;
    id: string;
  };

  export type ActivityInfo = {
    name: string;
    rating: number;
    review_count: number;
    image_url: string;
    url: string;  
    latitude: number;
    longitude: number;
  }

export type TripCardData = {
    trip_name: string;
    trip_owner: string;
    trip_dest: string;
    start_date: string;
    end_date: string;
    participants: Participant[];
    activities: ActivityInfo[];
  };