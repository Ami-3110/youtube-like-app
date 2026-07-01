// frontend/hooks/useCurrentUser.ts
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth";

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  handle: string | null;
  avatar_path: string | null;
  is_admin: boolean;
};

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  return {
    currentUser,
    isLoading,
  };
}