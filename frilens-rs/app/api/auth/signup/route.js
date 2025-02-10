import clientPromise from "@/libs/mongo"; // Use the clientPromise
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
    }

    console.log("✅ Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists." }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log("✅ User created successfully!");
    return new Response(JSON.stringify({ message: "User created successfully!" }), { status: 201 });
  } catch (error) {
    console.error("❌ Signup API Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
