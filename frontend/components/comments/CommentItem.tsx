// frontend/components/comments/CommentItem.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Comment } from "@/types/comment";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type CommentItemProps = {
  comment: Comment;
  onDelete: (commentId: number) => void;
};

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleDelete(commentId: number) {
    const res = await fetch(`http://localhost:8000/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("削除に失敗しました");
      return;
    }

    onDelete(commentId);
    setIsDeleteModalOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <>
      <div className="rounded-xl bg-slate-900/70 p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm font-semibold text-white">
              {comment.user.name}
            </span>
            <span className="ml-2 text-xs text-slate-400">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full p-2 hover:bg-slate-800"
            >
              <BsThreeDotsVertical size={16} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-10 z-10 w-24 rounded-xl bg-slate-800 shadow-lg">
                <button className="flex w-full items-center gap-2 px-5 py-3 hover:bg-slate-700">
                  <FiEdit size={18} />
                  <span className="text-sm">編集</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 px-5 py-3 hover:bg-slate-700"
                >
                  <FiTrash2 size={18} />
                  <span className="text-sm">削除</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-200">{comment.body}</p>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="コメントの削除"
        message="コメントを完全に削除しますか？"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(comment.id)}
      />
    </>
  );
}