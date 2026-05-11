export interface Movie {
  id: string; // เปลี่ยนเป็น string รองรับ M00001
  title: string;
  ageRating: string;
  year: string;
  genre: string;
  language: string;
  price: string;
  poster: string;
  backdrop: string;
  synopsis: string;
  score: string;
  stars: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: string;
  poster: string;
}

export interface Review {
  username: string;
  avatar: string;
  score: string;
  stars: number;
  text: string;
  date: string;
}