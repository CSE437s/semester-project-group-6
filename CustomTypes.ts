export type Participant = {
  uid: string;
  email: string;
  profilePicURL: string;
  firstName: string;
  lastName: string;
  };

  export type ActivityInfo = {
    name: string;
    rating: number;
    review_count: number;
    image_url: string;
    url: string;  
    location: object;
  }

export type TripCardData = {
    trip_name: string;
    trip_owner: string;
    trip_dest: string;
    start_date: string;
    end_date: string;
    place_id: string;
    participants: Participant[];
    activities: ActivityInfo[];
  };