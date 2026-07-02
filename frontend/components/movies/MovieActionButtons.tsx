// frontend/components/movies/MovieActionButtons.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMovie } from "@/lib/api/movies";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { getCurrentUser } from "@/lib/api/auth";

type Props = {
  movieId: number;
  ownerId: number;
};

export default function MovieActionButtons({ movieId, ownerId }: Props) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setIsOwner(currentUser?.id === ownerId);
      setIsAdmin(Boolean(currentUser?.is_admin));
    }

    fetchUser();
  }, [ownerId]);

    async function handleDelete() {
    try {    
      await deleteMovie(movieId);      
      alert("動画を削除しました");      
      router.push("/dashboard");      
    } catch (error) {      
      console.error(error);      
      alert("動画の削除に失敗しました");      
    }    
  };

  if (!isOwner && !isAdmin) {
    return null;
  }
 
  return (
    <>
      <div className="flex gap-2">
        {isOwner && (
          <Link
            href={`/movies/${movieId}/edit`}
            className="rounded-full border border-(--border) bg-(--surface-2) px-4 py-2 text-sm text-(--text-main) hover:bg-(--surface-3)"
          >
            編集
          </Link>
        )}

        {(isOwner || isAdmin) && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-full bg-(--danger-bg) px-5 py-2 text-sm font-semibold text-(--danger-text) hover:bg-(--danger-hover)"
          >
            削除
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="動画を削除しますか？"
        message="この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
