// frontend/components/comments/CommentSectiom.tsx
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

type CommentSectionProps = {
  movieId: string;
  comments: Comment[];
};

export function CommentSection({ movieId, comments }: CommentSectionProps) {
  return (
    <section className="mt-8 max-w-4xl">
      <h2 className="text-xl font-bold text-white">
        コメント {comments.length}件
      </h2>

      <div className="mt-6 flex gap-3">
        <CommentForm movieId={movieId} />
      </div>

      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}