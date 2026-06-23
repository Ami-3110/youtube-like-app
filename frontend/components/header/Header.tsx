// frontend/components/header/Header.tsx
import Logo from "./Logo";
import SearchBar from "./SearchBar";


import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-slate-950">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Logo />

        <SearchBar />

        <UserMenu />
      </div>
    </header>
  );
}

