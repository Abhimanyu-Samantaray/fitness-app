import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("jwt");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        navigate("/");
    };

    return (
        <nav style={styles.nav}>
            <h3 style={styles.logo}>Fitness App</h3>

            {/* <div style={styles.links}>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/users" style={styles.link}>Users</Link>
            </div> */}
            {token &&
                <button onClick={handleLogout} style={styles.button}>
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