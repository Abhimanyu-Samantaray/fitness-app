import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("jwt");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = jwtDecode(token);

        if (user.role === "ADMIN") {
            return children;
        } else {
            return <Navigate to="/unauthorized" replace />;
        }

    } catch (e) {
        localStorage.removeItem("jwt");
        return <Navigate to="/login" replace />;
    }
}