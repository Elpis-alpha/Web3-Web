"use client";
import StudentIntroForm from "@/source/components/intros/StudentIntroForm";
import StudentIntroList from "@/source/components/intros/StudentIntroList";

export default function Home() {

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-20 text-sm sm:text-base">
      <StudentIntroForm />
      <StudentIntroList />
    </main>
  );
}
