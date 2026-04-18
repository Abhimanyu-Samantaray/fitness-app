import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const token = localStorage.getItem("jwt");

    // If user already logged in → block login page
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}