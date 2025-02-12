
import ButtonLogout from "@/components/ButtonLogout";
import PaymentForm from "@/components/PaymentForm";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";


async function getUser() {
	const session = await auth();

	await connectMongo();

	return await User.findById(session.user.id).populate("payments");
}


export default async function Dashboard(){
    const user = await getUser();
    
    return (
        <main className="bg-base-200 min-h-screen">
            {/*HEADER*/}
            <section className="bg-base-100">
                <div className="px-5 py-3 flex justify-end max-w-5xl mx-auto">
            <ButtonLogout/>
                </div>
            </section>

                   {/* Payments Section */}
                   <section className="max-w-5xl mx-auto px-5 py-12">
                    <PaymentForm/>
                   </section>

                   <div>
                        <h1 className="font-extrabold text-xl">
                            Uplate
                        </h1>
                   </div>
                  
        </main>
    );
}