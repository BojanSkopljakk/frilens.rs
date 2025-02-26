import Image from "next/image";
import ButtonLogin from "@/components/ButtonLogin";
import FAQListItem from "@/components/FAQListItem";
import productDemo from "@/app/Work_from_home-removebg-preview.png";
import { auth } from "@/auth";

export default async function Home() {
  const isLoggedIn = true;
  const pricingFeaturesList = [
    "Evidencija ostvarenih prihoda",
    "Kalkulator poreskih obaveza",
    "Optimizacija poreza",
  ];

  const session = await auth();

  return (
    <main>
      {/* HEADER */}
      <section className="bg-base-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-8 py-2">
          <div className="font-bold">Frilens.rs</div>
          <div className="space-x-4 max-md:hidden">
            <a className="link link-hover" href="#pricing">
              Cena
            </a>
            <a className="link link-hover" href="#faq">
              {" "}
              Pitanja
            </a>
            <a className="link link-hover" href="/dashboard">
              Prihodi
            </a>
          </div>

          <div>
            <ButtonLogin session={session} />
          </div>
        </div>
      </section>

      {/* HERO */}

      <section className="px-8 text-center lg:text-left py-32 max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 items-center lg:items-start">
        <div className="mt-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Lakše Frilens Poslovanje
          </h1>
          <div className="opacity-90 mb-10">
            Evidencija frilens prihoda, praćenje i optimizacija poreskih obaveza
          </div>
          <ButtonLogin session={session} />
        </div>
        <Image
          src={productDemo}
          alt="Product demo"
          className="w-96 rounded-xl"
        />
      </section>

      {/* PRICE */}
      {/* PRICE */}
      <section className="bg-base-200" id="pricing">
        <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-4">
            Cenovnik
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">
            Transparentne cene
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Version */}
            <div className="bg-base-100 p-8 rounded-3xl">
              <div className="flex gap-2 items-baseline">
                <div className="text-4xl font-black pb-4">0rsd</div>
                <div className="uppercase text-sm font-medium opacity-60">
                  /mesec
                </div>
              </div>
              <ul className="space-y-2 pb-4">
                {pricingFeaturesList.map((priceItem) => {
                  return (
                    <li className="flex gap-2 items-center" key={priceItem}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-500 size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {priceItem}
                    </li>
                  );
                })}
              </ul>
              <ButtonLogin session={session} extraStyle="w-full"></ButtonLogin>
            </div>

            {/* Paid Version */}
            <div className="bg-base-100 p-8 rounded-3xl border border-primary">
              <div className="flex gap-2 items-baseline">
                <div className="text-4xl font-black pb-4">999rsd</div>
                <div className="uppercase text-sm font-medium opacity-60">
                  /mesec
                </div>
              </div>
              <ul className="space-y-2 pb-4">
                {[...pricingFeaturesList, "Napredna statistika"].map(
                  (priceItem) => {
                    return (
                      <li className="flex gap-2 items-center" key={priceItem}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-green-500 size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                        {priceItem}
                      </li>
                    );
                  }
                )}
              </ul>
              <ButtonLogin session={session} extraStyle="w-full"></ButtonLogin>
            </div>
          </div>
        </div>
      </section>

      {/*FAQ*/}

      <section id="faq">
        <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-4">
            Najčešća pitanja
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">
            Pitanja i Odgovori
          </h2>

          <ul className="max-w-lg mx-auto">
            {[
              {
                question: "Koliko dugo imam pristup plaćenoj verziji?",
                answer:
                  "Nakon što platite 999rsd imate zauvek pristup aplikaciji.",
              },
              {
                question:
                  "Da li ova aplikacija ima veze sa frilenseri.purs.gov.rs?",
                answer:
                  "Aplikacija nema nikakve veze sa zvaničnim frilenserskim protalom.",
              },
              {
                question:
                  "Da li poreska uprava ima uvid u moje prihode na vašoj aplikaciji?",
                answer:
                  "Poreska uprava nema uvid u vaše prihode, vi ste sami odgovorni da podnosite poreske prijave svaki kvartal.",
              },
            ].map((qa) => (
              <FAQListItem key={qa.question} qa={qa} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
