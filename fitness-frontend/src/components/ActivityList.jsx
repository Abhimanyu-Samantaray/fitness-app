import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Trash2 } from "lucide-react";
import {ArrowLeft } from "lucide-react";
import React,{useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://fitness-app-0ulb.onrender.com";


const ActivityList = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchActivities();
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
                                            onClick={() => navigate(`/ai-recommendation/${act.id}`)}
                                        >
                                            <td className="ps-4">
                                                <span className="badge rounded-pill bg-info text-dark me-2">{act.type}</span>
                                            </td>
                                            <td>{act.duration} mins</td>
                                            <td>{act.caloriesBurned} Kcal</td>
                                            <td>{act.startTime}</td>
                                            <td>N/A</td>
                                            <td className="text-center">
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