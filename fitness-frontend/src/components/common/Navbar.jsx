import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar() {
    const token = localStorage.getItem("jwt");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        navigate("/login");
    };

    return (
        <nav style={styles.nav}>
            <h3 style={styles.logo}>Fitness App</h3>
            {token &&
                <button onClick={handleLogout} className="btn btn-danger">
                    <LogOut size={18} className="bg-info mb-1 me-1 rounded-2"/>
                    Logout
                </button>
            }
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "white"
    },
    logo: {
        margin: 0
    },
    links: {
        display: "flex",
        gap: "15px"
    },
    link: {
        color: "white",
        textDecoration: "none"
    },
    button: {
        background: "white",
        color: "#1976d2",
        border: "none",
        padding: "6px 12px",
        cursor: "pointer"
    }
};