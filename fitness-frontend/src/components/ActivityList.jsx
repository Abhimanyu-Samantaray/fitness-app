import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Trash2 } from "lucide-react";
import {ArrowLeft } from "lucide-react";
import React,{useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./apiConfig/gateWay";
import { Eye } from "lucide-react";
import { RefreshCw } from "lucide-react";


const ActivityList = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");
    const [spin, setSpin] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const spinHandle = async  (id) => {
        setSpin(id);

        // ✅ 1. Optimistic update (immediately update UI)
        setActivities(prev =>
            prev.map(a =>
                a.id === id
                    ? { ...a, status: "GENERATING..." }
                    : a
            )
        );


        try {
            // 1. wait for DB update to complete
            await generateRecommendation(id);

            // 2. NOW DB is updated → fetch fresh data
           const interval = setInterval(async () => {
                const res = await fetchActivities();

                const updated = res.find(a => a.id === id);

                if (updated.status === "GENERATED") {
                    clearInterval(interval);
                }
            }, 2000);

        } catch (err) {
            console.log(err);
        } finally {
            setTimeout(() => {
                setSpin(null);
            }, 90000); // 30 seconds
        }

    };

    const fetchActivities = async () => {
            try{
                const response = await axios.get(`${BASE_URL}/api/activities/`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setActivities(response.data);
                setLoading(false);
            } catch (error) {
                console.log("Error Fetching Data "+ error);
                setLoading(false);
            }
        }

    useEffect(() => {
        fetchActivities();
    }, [token]);

    const handleDelete = async (id) => {

        try {
            const response = await fetch(`${BASE_URL}/api/activities/del/${id}`, {
                method: "DELETE",
                headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
            });

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            // 🔥 Update UI instantly
            setActivities(prev =>
                prev.filter(activity => activity.id !== id)
            );

        } catch(err) {
            console.log(err);
        }

    }

    const generateRecommendation = async (id) => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/activities/ai-recommendation/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();
            console.log("Response:", data);

            // // optional navigation after API call
            

        } catch (error) {
            console.error("API error:", error);
        }
    };

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }, []);

    if(loading) return <div className="text-center mt-5"><p className="fw-bold">Loading Activities...</p></div>

     return(
        <>
            <div className="container mt-4 mb-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Activity Log</h5>
                        <Link to="/add-activity" className="btn btn-lg btn-success btn-sm">
                            <PlusCircle size={18} className="bg-info mb-1 me-1 rounded-2"/>
                           Add New
                        </Link>
                        <button onClick={() => navigate(-1)} className="btn btn-sm btn-primary float-end">
                            <ArrowLeft size={18} className="bg-info mb-1 me-1 rounded-2"/>
                            Back
                        </button>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Generate</th>
                                        <th scope="col" className="ps-4">Activity Type</th>
                                        <th scope="col">Duration</th>
                                        <th scope="col">Calories Burned</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example Row - You would map your activities here */}
                                    {activities.map((act) => (
                                        <tr 
                                            key={act.id}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>
                                                <RefreshCw className="text-primary ms-4"
                                                    onClick={() => spinHandle(act.id)}
                                                    style={{
                                                        cursor: "pointer",
                                                        display: "inline-block",
                                                        animation: spin === act.id ? "spin 0.6s linear" : "none"
                                                    }}
                                                />
                                            </td>
                                            <td className="ps-4">
                                                <span className="badge rounded-pill bg-info text-dark me-2">{act.type}</span>
                                            </td>
                                            <td>{act.duration} mins</td>
                                            <td>{act.caloriesBurned} Kcal</td>
                                            <td>{act.startTime}</td>
                                            <td style={{ color: act.status === "GENERATED" ? "green" : "red" }}>{act.status}!</td>
                                            <td className="text-center">
                                                <button className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => navigate(`/ai-recommendation/${act.id}`)}
                                                >
                                                    <Eye size={18} className="bg-info mb-1 me-1 rounded-2"/>
                                                    View
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // ✅ prevents row click
                                                        handleDelete(act.id);
                                                    }}
                                                >
                                                    <Trash2 size={18} className="bg-info mb-1 me-1 rounded-2"/>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        ))}
                                    {/* More rows... */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
};

export default ActivityList;