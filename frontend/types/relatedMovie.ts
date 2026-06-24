// frontend/app/types/relatedMovie.ts

export type RelatedTopic = {
  id: number;
  name: string;
};

export type RelatedMovie = {
  id: number;
  title: string;
  thumbnail_path: string | null;
  views: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  topics: RelatedTopic[];
};
