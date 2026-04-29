import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "https://fitness-app-0ulb.onrender.com";

const VerifyOtp = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        if(!otp) {
            setMessage("Please Enter OTP");
            return;
        }

        try{
            setLoading(true);
            setMessage("");
            const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp }),
            });

            const text = await response.text();
            if (!response.ok) {
                throw new Error(text || "Invalid OTP");
            }

            setMessage("OTP verified successfully! Redirecting...");

            // store flag for reset password page
            sessionStorage.setItem("otpVerified", "true");
            sessionStorage.setItem("resetEmail", email);

            setTimeout(() => {
                navigate("/reset-password");
            }, 3000);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow p-4" style={{ width: "400px" }}>
                    <h3 className="text-center mb-3">Verify OTP</h3>

                    {/* Show email */}
                    <p className="text-center text-muted">
                    OTP sent to: <b>{email}</b>
                    </p>

                    <form onSubmit={handleVerify}>
                    <div className="mb-3">
                        <label className="form-label">Enter OTP</label>
                        <input
                        type="text"
                        className="form-control text-center"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
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

export default VerifyOtp;