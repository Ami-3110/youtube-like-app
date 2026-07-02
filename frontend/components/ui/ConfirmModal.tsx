// frontend/components/ui/ConfirmModal.tsx
type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--surface-1) p-6 text-(--text-main)"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="mt-6 text-(--text-sub)">{message}</p>

        <div className="mt-8 flex justify-end gap-6">
          <button
            type="button"
            onClick={onCancel}
            className="text-(--text-sub) hover:text-(--text-main)"
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="font-semibold text-(--danger-bg) hover:text-(--danger-hover)"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}