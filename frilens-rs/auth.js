import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import Google from "next-auth/providers/google";


export const {handlers, signIn, signOut, auth} = NextAuth(

{
  providers: [

    Google({

      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET

    })
  ],
  adapter: MongoDBAdapter(clientPromise),

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },

  },

}
);
