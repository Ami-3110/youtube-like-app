// frontend/components/Header.tsx
import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-2">
        <svg
          width="48"
          height="36"
          viewBox="0 0 88 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="seatubeClip">
              <rect width="88" height="64" rx="18" />
            </clipPath>
          </defs>

          <g clipPath="url(#seatubeClip)">
            {/* 空 */}
            <rect width="88" height="64" fill="#38BDF8" />

            {/* 海 */}
            <path
              d="
                M0 37
                C8 37 8 27 16 27
                C24 27 24 37 32 37
                C40 37 40 27 48 27
                C56 27 56 37 64 37
                C72 37 72 27 80 27
                C84 27 86 29 88 31
                V64
                H0
                Z
              "
              fill="#1D4ED8"
            />

            {/* 波線 */}
            <path
              d="
                M0 37
                C8 37 8 27 16 27
                C24 27 24 37 32 37
                C40 37 40 27 48 27
                C56 27 56 37 64 37
                C72 37 72 27 80 27
                C84 27 86 29 88 31
              "
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* 再生ボタン */}
            <path d="M35 18L62 32L35 46V18Z" fill="white" />
          </g>
        </svg>

        <span className="text-xl font-semibold tracking-tight text-sky-400">
          SeaTube
        </span>
      </div>
    </header>
  );
}