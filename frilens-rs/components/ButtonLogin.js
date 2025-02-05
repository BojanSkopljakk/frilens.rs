import Link from "next/link";
const ButtonLogin = ({isLoggedIn, extraStyle}) => {

    if (isLoggedIn) {
    return <Link href="/dashboard" className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}>Dashboard</Link>;
    } else {
        return <button>Login</button>;
    }
};

export default ButtonLogin;