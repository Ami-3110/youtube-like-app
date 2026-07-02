// 未使用です。frontend/components/header/NotigicationButton.tsx
import { AiOutlineBell } from "react-icons/ai";

export default function NotificationButton() {
  return (
    <div className="pt-1">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-slate-800"
      >
        <AiOutlineBell size={24} />
      </button>
    </div>
  );
}