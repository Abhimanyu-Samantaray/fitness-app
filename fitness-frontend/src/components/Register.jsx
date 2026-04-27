import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://fitness-app-0ulb.onrender.com";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name] : value,
        });
    }
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if(!response.ok) {
                throw new Error("Registration Failed");
            }
            const data = await response.json();
            setMessage("Registration Successful");

        } catch(err) {
            setMessage("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
           <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow" style={{ width: "350px" }}>
                    <h3 className="text-center mb-3">Register</h3>

                    {message && (
                    <div className="alert alert-info text-center">{message}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                        {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register; 