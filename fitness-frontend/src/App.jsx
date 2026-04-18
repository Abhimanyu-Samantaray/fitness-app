import Login from "./components/Login";
import {Routes, Route} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoutes";
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
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

            <Footer/>
        </>
    );
}

export default App
