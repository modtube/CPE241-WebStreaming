import type { Movie, Review } from './CustomerType';

export const MOVIES: Movie[] = [
  {
    id: "M00000",
    title: "System Offline Placeholder",
    ageRating: "N/A",
    year: "20XX",
    genre: "Unknown",
    language: "Unknown",
    price: "$0.00",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    synopsis: "ข้อมูลจำลอง (Mock Data) โปรดเชื่อมต่อฐานข้อมูล",
    score: "0.0",
    stars: 0,
  }
];

export const PLACEHOLDER_CREW = [
  { name: "Elena Cross",   role: "Lead Actress",     avatar: "https://i.pravatar.cc/40?img=1"  },
  { name: "James Harlow",  role: "Lead Actor",       avatar: "https://i.pravatar.cc/40?img=12" },
  { name: "Sofia Reyes",   role: "Director",         avatar: "https://i.pravatar.cc/40?img=5"  },
];

export const PLACEHOLDER_REVIEWS: Review[] = [
  {
    username: "moviefan_92",
    avatar: "https://i.pravatar.cc/36?img=33",
    score: "9.2",
    stars: 5,
    text: "Absolutely gripping from start to finish.",
    date: "Jan 12, 2026",
  }
];