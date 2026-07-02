// frontend/app/upload/page.tsx
import Header from "@/components/header/Header";
import MovieForm from "@/components/movies/MovieForm";

export default function UploadPage() {
  return (
    <>
      <Header />
      <main className="w-full mx-auto max-w-6xl bg-linear-to-b from-(--page-from) to-(--page-to) px-4 py-8">
        <MovieForm />
      </main>
    </>
  );
}