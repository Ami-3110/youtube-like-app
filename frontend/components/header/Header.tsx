// frontend/components/header/Header.tsx
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UploadButton from "./UploadButton";
// import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-sky-950">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_auto] items-center gap-2 px-4 py-2 md:grid-cols-[auto_1fr_auto]">
        <div className="min-w-0">
          <Logo />
        </div>

        <div className="justify-self-end md:order-3">
          <div className="flex items-center gap-4">
            <UploadButton />
            {/* 通知機能実装時に再度追加 */}
            {/* <NotificationButton /> */}
            <UserMenu />
          </div>
        </div>

        <div className="col-span-2 w-full md:order-2 md:col-span-1 md:mx-8 md:max-w-xl md:justify-self-center">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
