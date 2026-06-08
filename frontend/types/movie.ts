// frontend/app/types/movie.ts

export type Movie = {
  id: number;
  title: string;
  user: string;
  thumbnail_path: string | null;
  topics: string[];
  views: number;
  created_at: string;
};
