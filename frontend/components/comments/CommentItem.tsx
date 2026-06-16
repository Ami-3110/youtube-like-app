// frontend/components/comments/CommentItem.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Comment } from "@/types/comment";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { deleteComment, updateComment } from "@/lib/api/comments";
import { ConfirmModal } from "@/components/ui/ConfirmModal";


type CommentItemProps = {
  comment: Comment;
  onUpdate: (Updatedomment: Comment) => void;
  onDelete: (commentId: number) => void;
};

export function CommentItem({
  comment,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleUpdate() {
    if (!editBody.trim()) {
      alert("コメントを入力してください");
      return;
    }

    try {
      const updatedComment = await updateComment(
        comment.id,
        editBody,
      );
      
      onUpdate(updatedComment);

      setIsEditing(false);
      setIsMenuOpen(false);
    } catch {
      alert("コメントの編集に失敗しました");
    }
  }

  async function handleDelete(commentId: number) {
    try {
      await deleteComment(commentId);

      onDelete(commentId);
      setIsDeleteModalOpen(false);      
    } catch {
      alert("コメントの削除に失敗しました");
    }
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
                <button
                  type="button"
                  onClick={() =>{
                    setIsMenuOpen(false);
                    setIsEditing(true);
                  }}
                  className="flex w-full items-center gap-2 px-5 py-3 hover:bg-slate-700">
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

        {isEditing ? (
          <div>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="mt-2 w-full rounded-lg bg-slate-800 p-2 text-sm text-white"
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="rounded-full bg-white px-4 py-1 text-sm text-slate-950"
              >
                保存
              </button>

              <button
                type="button"
                onClick={() => {
                setEditBody(comment.body);
                setIsEditing(false);
                }}
                className="rounded-full px-4 py-1 text-sm text-slate-300 hover:bg-slate-800"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-200">
            {comment.body}
          </p>
        )}
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