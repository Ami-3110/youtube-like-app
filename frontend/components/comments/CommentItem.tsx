// frontend/components/comments/CommentItem.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Comment } from "@/types/comment";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { deleteComment, updateComment } from "@/lib/api/comments";
import { mediaUrl } from "@/lib/mediaUrl";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import CommentReactionButtons from "./CommentReactionButtons";
import { CommentForm } from "./CommentForm";

type CommentItemProps = {
  comment: Comment;
  movieId: string;
  currentUserId: number | null;
  currentUser: {
    id: number;
    name: string;
    avatar_path: string | null;
    is_admin: boolean;
  } | null;
  onUpdate: (UpdatedComment: Comment) => void;
  onDelete: (commentId: number) => void;
  onAddComment: (comment: Comment) => void;
};

export function CommentItem({
  comment,
  movieId,
  currentUserId,
  currentUser,
  onUpdate,
  onDelete,
  onAddComment,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isOwner = currentUserId === comment.user.id;
  const isAdmin = Boolean(currentUser?.is_admin);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

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
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-500 text-sm font-bold text-white">
              {comment.user.avatar_path ? (
                <img
                  src={mediaUrl(comment.user.avatar_path)}
                  alt={comment.user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                comment.user.name.slice(0, 1)
              )}
            </div>

            <div>
              <span className="text-sm font-semibold text-white">
                {comment.user.name}
              </span>
              <span className="ml-2 text-xs text-slate-400">
                {formatRelativeTime(comment.created_at)}
              </span>

              {comment.created_at !== comment.updated_at && (
                <span className="ml-2 text-xs text-slate-500">
                  （編集済み）
                </span>
              )}
            </div>
          </div>

          {(isOwner || isAdmin) && (
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
                  {isOwner && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditing(true);
                    }}
                    className="flex w-full items-center gap-2 px-5 py-3 hover:bg-slate-700"
                  >
                    <FiEdit size={18} />
                    <span className="text-sm">編集</span>
                  </button>
                  )}                             

                  {(isOwner || isAdmin) && (
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
                  )}                  
                </div>
              )}
            </div>
          )}
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
          <p className="mt-2 ml-12 text-sm text-slate-200">{comment.body}</p>
        )}
        <div className="mt-3 ml-12 flex items-center gap-5">
          <CommentReactionButtons commentId={comment.id} />

          <button
            type="button"
            onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
            className="rounded-full px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
          >
            返信
          </button>
        </div>

        {isReplyFormOpen && (
          <div className="mt-3">
            <CommentForm
              movieId={movieId}
              parentId={comment.id}
              currentUser={currentUser}
              onAddComment={(newComment) => {
                onAddComment(newComment);
                setIsReplyFormOpen(false);
              }}
            />
          </div>
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