import { Link, NavLink } from "react-router";

export default function Header() {
     return (
        <header>
            <Link to="/">
                <img src="/images/loutre.png" className="logo" />
            </Link>
            <nav>
                <NavLink to="/">Présentation</NavLink>
                <NavLink to="/feeding">Alimentation</NavLink>
            </nav>
        </header>
    )
}