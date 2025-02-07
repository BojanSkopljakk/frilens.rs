import Image from "next/image";
import ButtonLogin from "@/components/ButtonLogin";
import FAQListItem from "@/components/FAQListItem";
import productDemo from "@/app/Work_from_home-removebg-preview.png";


export default function Home() {
  const isLoggedIn = true;
  const pricingFeaturesList = [
    "Evidencija ostvarenih prihoda",
    "Kalkulator poreskih obaveza",
    "Optimizacija poreza",
    "1 korisnik"


  ];


  return (
    <main>
      {/* HEADER */}
      <section className="bg-base-200">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-8 py-2">
        <div className="font-bold">Frilens.rs</div>
        <div className="space-x-4 max-md:hidden">
          <a className="link link-hover" href="#pricing">Cena</a>
          <a className="link link-hover" href="#faq"> FAQ</a>
        </div>

        <div>
          <ButtonLogin isLoggedIn = {isLoggedIn}/>
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
      <ButtonLogin isLoggedIn = {isLoggedIn}/>
      </div>
      <Image src={productDemo} alt="Product demo" className="w-96 rounded-xl"/>
      </section>

       {/* PRICE */}
       <section className="bg-base-200" id="pricing">
        <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-4">Cenovnik</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">Transparentne cene</h2>
        

        <div className="bg-base-100 p-8 max-w-96 rounded-3xl mx-auto">
          <div className="flex gap-2 items-baseline">
          <div className="text-4xl font-black">
          0rsd
          </div>
          <div className="uppercase text-sm font-medium opacity-60">/mesec</div>
          </div>
          <ul className="space-y-2">
              {
                pricingFeaturesList.map (
                  (priceItem) => {
                    return <li className="flex gap-2 items-center" key={priceItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500 size-4"fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                   <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {priceItem}
                    </li>
                  }
                )
              }
              

          </ul>

          <ButtonLogin isLoggedIn ={isLoggedIn} extraStyle="w-full"></ButtonLogin>

        </div>
        </div>
       </section>

       {/*FAQ*/}

       <section  id="faq">

       <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-4">Cenovnik</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">Transparentne cene</h2>
            
            <ul className="max-w-lg mx-auto">
              {
              [
                {question: "Q", answer: "A"},
                {question: "Da li znas", answer: "Znam"}
                
              ].map((qa) => (
              <FAQListItem key={qa.question} qa={qa}/>

              ))
              }
            </ul>

       </div>


       </section>

    </main>
  );
}
