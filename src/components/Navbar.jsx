import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Bell, Menu, X, User, LogOut } from "lucide-react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "TV Shows", path: "/tv-shows" },
        { name: "My List", path: "/my-list" },
    ];
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const handleUserClick = () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        navigate("/profile");
    };
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const handleSearch = () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        navigate("/search");
    };

    return (
        <header className="navbar">
            <Link to="/" className="logo">
                NETFLIX
            </Link>
            <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            isActive ? "nav-link active-link" : "nav-link"
                        }
                        onClick={() => setMenuOpen(false)}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="nav-actions">
                <button className="icon-btn" aria-label="Search" onClick={handleSearch}>
                    <Search size={21} />
                </button>

                <button className="icon-btn" aria-label="Notifications">
                    <Bell size={21} />
                </button>

                {currentUser && (
                    <button
                        className="icon-btn"
                        onClick={handleLogout}
                        aria-label="Logout"
                        title="Logout"
                    >
                        <LogOut size={21} />
                    </button>
                )}

                <button
                    className="profile-btn"
                    aria-label="Profile"
                    onClick={handleUserClick}
                >
                    <User size={20} />
                </button>
                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}

export default Navbar;