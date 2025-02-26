"use client";
import Link from "next/link";
import { signIn } from "next-auth/react"; //we dont import from auth for security reasons
const ButtonLogin = ({ session, extraStyle }) => {
  const dashboardUrl = "/dashboard";

  if (session) {
    return (
      <Link
        href={dashboardUrl}
        className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
      >
        Dobro Došao/la nazad {session.user.name || "friend"}
      </Link>
    );
  } else {
    return (
      <button
        className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
        onClick={() => {
          signIn(undefined, { callbackUrl: dashboardUrl });
        }}
      >
        Get started
      </button>
    );
  }
};

export default ButtonLogin;
