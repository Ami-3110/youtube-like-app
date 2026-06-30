// frontend/app/types/channel.ts

export type UpdateProfileRequest = {
  name: string;
  handle: string | null;
  bio: string | null;
};