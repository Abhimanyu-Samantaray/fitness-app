import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const BASE_URL = "https://fitness-app-0ulb.onrender.com";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response =  await axios.post(
                `${BASE_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );
            const token = response.data.token;
          
             // store token
            localStorage.setItem("jwt", token);

            alert("Login successful!");

            // optional: redirect
            // decode token
            const decoded = jwtDecode(token);
            const role = decoded.role;

            // role-based navigation
            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

            } catch (err) {
                console.log(err);
                setError("Invalid credentials or server error");
            }
        }; 

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit" className="btn btn-primary">
                        Sign In
                    </button>
                </form>

                <p style={styles.footerText}>
                    Forgot password?
                </p>
                 {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial",
    },
    card: {
        width: "320px",
        padding: "25px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    title: {
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        padding: "10px",
        margin: "8px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        outline: "none",
    },
    button: {
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    footerText: {
        marginTop: "15px",
        fontSize: "12px",
        color: "#777",
        cursor: "pointer",
    },
};