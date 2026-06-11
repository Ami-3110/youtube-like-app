// frontend/app/types/comment.ts

export type Comment = {
  id: number;
  movie_id: number;
  user_id: number;
  parent_id: number | null;
  body: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar_path: string | null;
  };
};