// frontend/components/header/Header.tsx
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UploadButton from "./UploadButton";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-sky-950">
      <div className="flex h-full max-w-7xl items-center justify-between px-4">
        <Logo />

        <SearchBar />
        <div className="flex items-center gap-4">
          <UploadButton />
          <NotificationButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

