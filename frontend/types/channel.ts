// frontend/app/types/channel.ts
import type { Movie } from "./movie";

export type Channel = {
  id: number;
  name: string;
  handle: string | null;
  bio: string | null;
  avatar_path: string | null;
  followers_count: number;
  movies: Movie[];
};