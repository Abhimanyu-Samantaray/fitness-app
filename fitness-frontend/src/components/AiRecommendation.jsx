import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";

const BASE_URL = "https://fitness-app-0ulb.onrender.com";

const AiRecommendation = () => {
    const token = localStorage.getItem("jwt");

    const navigate = useNavigate();

    const { id } = useParams();

    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let retryCount = 0;

        const fetchData = () => {
            fetch(`${BASE_URL}/api/recommendation/getRecommendation/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("Not ready");
                return res.json();
            })
            .then(data => {
                if (data && data.summary) {
                    setRecommendation(data);
                    setLoading(false); // ✅ stop loading
                } else {
                    throw new Error("Empty data");
                }
            })
            .catch(() => {
                if (retryCount < 5) {
                    retryCount++;
                    setTimeout(fetchData, 1500);
                } else {
                    setLoading(false); // stop loading after retries
                }
            });
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h5>⏳ Loading recommendation...</h5>
            </div>
        );
    }

    if (!loading && !recommendation) {
        return (
            <div className="text-center mt-5">
                <h5 className="text-warning">
                    ⏳ Still generating your recommendation...
                </h5>
                <p className="text-muted">
                    Please wait or try again or try after sometime
                </p>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCw size={18} className="bg-info mb-1 me-1 rounded-2" />
                    Refresh
                </button>
                <button onClick={() => navigate(-1)} className="btn mt-3 ms-2 btn-primary">
                    <ArrowLeft size={18} className="bg-info mb-1 me-1 rounded-2"/>
                    Back
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="container mt-4 mb-5">
                {/* 🔷 Summary Card */}
                <div className="card shadow-lg border-0 mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold">🏃 Activity Insight</h4>
                            <button onClick={() => navigate(-1)} className="btn btn-sm btn-primary float-end">
                                <ArrowLeft size={18} className="bg-info mb-1 me-1 rounded-2"/>
                                Back
                            </button>
                        </div>

                        <div className="mb-2">
                            <span className="badge bg-primary me-2">
                             {recommendation?.activityType}
                            </span>
                            <span className="badge bg-secondary">
                            {recommendation?.intensity}
                            </span>
                        </div>

                        <p className="mt-3 text-muted fs-5">
                            {recommendation?.summary}
                        </p>
                    </div>
                </div>

                {/* 🔷 3 Sections */}
                <div className="row g-3">

                    {/* ⚡ Improvements */}
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-start border-danger border-4">
                            <div className="card-body">
                                <h5 className="text-danger fw-bold">⚡ Improvements</h5>
                                <ul className="mt-3 ps-3">
                                    {recommendation?.improvements?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 💡 Suggestions */}
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-start border-success border-4">
                            <div className="card-body">
                                <h5 className="text-success fw-bold">💡 Suggestions</h5>

                                <ul className="mt-3 ps-3">
                                     {recommendation?.suggestions?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                </div>
                        </div>
                    </div>

                    {/* 🛡 Safety Tips */}
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-start border-warning border-4">
                            <div className="card-body">
                                <h5 className="text-warning fw-bold">🛡 Safety Tips</h5>

                                <ul className="mt-3 ps-3">
                                     {recommendation?.safetyTips?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default AiRecommendation;