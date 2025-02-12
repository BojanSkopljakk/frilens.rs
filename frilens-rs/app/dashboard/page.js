
import ButtonLogout from "@/components/ButtonLogout";
import PaymentForm from "@/components/PaymentForm";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment"; 


async function getUser() {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
        console.log("No valid session found.");
        return null;
    }

    await connectMongo();

    const user = await User.findOne({ email: session.user.email }).populate("payments");

    if (!user) {
        console.log("User not found in the database.");
    } else {
        console.log("Fetched user:", user);
    }

    return user;
}


export default async function Dashboard(){
    const user = await getUser();
    console.log(user);
    
    
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
                        {user.payments.length} Uplate
                        </h1>
                   </div>
                  
        </main>
    );
}