// frontend/app/types/movie.ts
import type { Topic } from "./topic";

export type Movie = {
  id: number;
  title: string;
  user: string;
  thumbnail_path: string | null;
  topics: Topic[];
  views: number;
  created_at: string;
};

export type MovieDetail = {
  id: number;
  title: string;
  description: string | null;
  user: {
    id: number;
    name: string;
    avatar_path: string | null;
  };
  movie_path: string | null;
  thumbnail_path: string | null;
  topics: Topic[];
  views: number;
  created_at: string;
};