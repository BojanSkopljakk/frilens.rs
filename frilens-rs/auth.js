import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("✅ Connecting to MongoDB via clientPromise...");
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection("users");

        // Find user by email
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          console.error("❌ User not found:", credentials.email);
          throw new Error("No user found with this email.");
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.error("❌ Incorrect password for:", credentials.email);
          throw new Error("Incorrect password.");
        }

        console.log("✅ User authenticated:", user.email);
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin", // Custom sign-in page
  },


  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
