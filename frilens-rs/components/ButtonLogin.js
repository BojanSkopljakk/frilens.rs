import Link from "next/link";
const ButtonLogin = (props) => {

    if (props.isLoggedIn) {
    return <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>;
    } else {
        return <button>Login</button>;
    }
};

export default ButtonLogin;