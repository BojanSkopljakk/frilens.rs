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

        // Check if the user signed up with Google and is trying to use a password
        if (!user.password) {
          console.error("❌ User signed up with Google, cannot use password login.");
          throw new Error("This email is linked to Google login. Please sign in with Google.");
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
    async signIn({ account, profile }) {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection("users");

      if (account.provider === "google") {
        // Check if user exists in DB
        let user = await usersCollection.findOne({ email: profile.email });

        if (!user) {
          console.log("✅ Creating new Google user:", profile.email);
          // Create a new user if doesn't exist
          user = await usersCollection.insertOne({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            emailVerified: new Date(),
          });
        }
      }
      return true;
    },
  },
});
