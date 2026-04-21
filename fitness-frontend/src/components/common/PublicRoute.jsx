import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PublicRoute({ children }) {
    const token = localStorage.getItem("jwt");

    if (token) {
        try {
            const user = jwtDecode(token);

            // redirect based on role
            if (user.role === "ADMIN") {
                return <Navigate to="/admin" replace />;
            }

            return <Navigate to="/dashboard" replace />;
        } catch (e) {
            localStorage.removeItem("jwt");
        }
    }

    return children;
}