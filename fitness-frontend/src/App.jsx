import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import {Routes, Route} from "react-router-dom";
import UserDashboard from "./components/Dashboard";
import AdminDashboard from "./components/admin/Dashboard";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoutes";
import AdminRoute from "./components/common/AdminRoute";
import PublicRoute from "./components/common/PublicRoute";
import Footer from "./components/common/Footer";

function App() {
    return (
        <>
            <Navbar/>

            <Routes>
                 <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                 <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

            </Routes>

            <Footer/>
        </>
    );
}

export default App
