import { Link } from "react-router";

export default function Header() {
     return (
        <header>
            <Link to="/">
                <img src="/images/loutre.png" className="logo" />
            </Link>
        </header>
    )
}