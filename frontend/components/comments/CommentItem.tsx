// frontend/components/comments/CommentItem.tsx

import { Comment } from "@/types/comment";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

type CommentItemProps = {
  comment: Comment;
};

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="rounded-xl bg-slate-900/70 p-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-white">{comment.user.name}</p>

        <p className="text-xs text-slate-400">
          {formatRelativeTime(comment.created_at)}
        </p>
      </div>
      <p className="mt-2 text-sm text-slate-200">{comment.body}</p>
    </div>
  );
}