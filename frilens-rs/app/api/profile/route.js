import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    console.log("🔍 Checking auth session...");
    const session = await auth();

    if (!session || !session.user) {
      console.log("❌ Unauthorized: No session found.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectMongo();
    console.log("✅ Connected to MongoDB");

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log("❌ User not found in DB.");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        name: user.name,
        email: user.email,
        image: user.image,
        isGoogleUser: !!user.image,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    console.log("🔄 Updating user profile...");
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const { name, oldPassword, newPassword } = await req.json();

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (user.image) {
        return new Response(
          JSON.stringify({ error: "Google users cannot change passwords" }),
          { status: 400 }
        );
      }

      if (!oldPassword) {
        return new Response(
          JSON.stringify({ error: "Old password is required" }),
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return new Response(
          JSON.stringify({ error: "Old password is incorrect" }),
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
