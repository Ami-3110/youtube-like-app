// frontend/components/comments/CommentItem.tsx

import { Comment } from "@/types/comment";

type CommentItemProps = {
  comment: Comment;
};

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="rounded-xl bg-slate-900/70 p-4">
      <p className="text-sm font-semibold text-white">
        {comment.user.name}
      </p>
      <p className="mt-2 text-sm text-slate-200">
        {comment.body}
      </p>
    </div>
  );
}