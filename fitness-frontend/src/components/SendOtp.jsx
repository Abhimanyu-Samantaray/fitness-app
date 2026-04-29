import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://fitness-app-0ulb.onrender.com";

const SendOtp = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("Email is required");
            return;
        }

        try {
                setLoading(true);
                setMessage("");

                const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email }),
                });

                const text = await response.text();

                if (!response.ok) {
                    throw new Error(text || "Failed to send OTP");
                }

                setMessage("OTP sent successfully to your email!");

                // ⏳ Redirect after 2 seconds
                setTimeout(() => {
                    navigate("/verify-otp", { state: { email } });
                }, 3000);
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
    };
    

    return (
        <>
         <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">Forgot Password</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Please Enter Your Valid Email Address:</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                {message && (
                <div className="alert alert-info mt-3 text-center">
                    {message}
                </div>
                )}
            </div>
        </div>
        </>
    );
}

export default SendOtp;