import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import UserDashboard from "./components/Dashboard";
import FitnessHome from "./components/FitnessHome";
import AdminDashboard from "./components/admin/Dashboard";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoutes";
import AdminRoute from "./components/common/AdminRoute";
import PublicRoute from "./components/common/PublicRoute";
import Footer from "./components/common/Footer";
import AddActivity from "./components/AddActivity";
import ActivityList from "./components/ActivityList";
import AiRecommendation from "./components/AiRecommendation";
import Register from "./components/Register";

function App() {

    return (
        <>
         <div className="app-container">
            <Navbar/>

            <main className="content">
                
                <Routes>

                    {/*PUBLIC ROUTES*/}

                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <FitnessHome />
                            </PublicRoute>
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />


                    { /*USER ROUTES */}

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/activity-list"
                        element={
                            <ProtectedRoute>
                            <ActivityList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-activity"
                        element={
                            <ProtectedRoute>
                            <AddActivity />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/ai-recommendation/:id"
                        element={
                            <ProtectedRoute>
                            <AiRecommendation/>
                            </ProtectedRoute>
                        }
                    />

                   { /*ADMIN ROUTES */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />

                </Routes>
                
            </main>

            <Footer/>
        </div>
        </>
    );
}

export default App
