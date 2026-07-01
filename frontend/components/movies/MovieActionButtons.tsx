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

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setIsOwner(currentUser?.id === ownerId);
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

  if (!isOwner) {
    return null;
  }
 
  return (
    <>
      <div className="flex gap-2">
        <Link
          href={`/movies/${movieId}/edit`}
          className="rounded-full bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
        >
          編集
        </Link>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-950"
        >
          削除
        </button>
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
