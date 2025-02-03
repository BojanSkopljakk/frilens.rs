import Image from "next/image";
import ButtonLogin from "@/components/ButtonLogin";

export default function Home() {
  const isLoggedIn = true;
  return (
    <main>
      <section className="bg-base-200">
      <div className="max-w-3xl mx-auto flex justify-between items-center px-8 py-2">
        <div className="font-bold">Frilens.rs</div>
        <div className="space-x-4 max-md:hidden">
          <a className="link link-hover">Cena</a>
          <a className="link link-hover"> FAQ</a>
        </div>

        <div>
          <ButtonLogin isLoggedIn = {isLoggedIn}/>
        </div>

      </div>
      </section>

      <section className="px-8 text-center py-32 max-w-3xl mx-auto">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">
        Lakše Frilens Poslovanje
        </h1>
      <div className="opacity-90 mb-10">
        Evidencija frilens prihoda, praćenje i optimizacija poreskih obaveza
      </div>
      <ButtonLogin isLoggedIn = {isLoggedIn}/>
      </section>
    </main>
  );
}
