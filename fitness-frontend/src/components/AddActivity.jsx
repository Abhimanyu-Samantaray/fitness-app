import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

const AddActivity = () => {

    const navigate = useNavigate();
    const BASE_URL = "http://localhost:8084";

    const [Activity, setActivity] = useState({
        type: "",
        duration: "",
        caloriesBurned: "",
        startTime: "",
        additionalMetrics: {}
    });

    const [metricInput, setMetricInput] = useState([
        { key: "", value: "" },
        { key: "", value: "" },
        { key: "", value: "" },
        { key: "", value: "" }
    ]);

    const buildadditionalMetricsObject = () => {
        const additionalMetricsObj = {};

        metricInput.forEach((item) => {
            if (item.key && item.value) {
                additionalMetricsObj[item.key] = item.value;
            }
        });

        return additionalMetricsObj;
    };
    const token = localStorage.getItem("jwt");
    const handleSubmit = async (e) =>  {
        e.preventDefault();

        const finalActivity = {
            ...Activity,
            additionalMetrics: buildadditionalMetricsObject()
        };

        try {
            const response = await fetch(`${BASE_URL}/api/activities/addActivity`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(finalActivity)
            });
            if (!response.ok) {
                throw new Error("Failed to save activity");
            }

                const data = await response.json();
                console.log("Success:", data);

                navigate("/activity-list"); // redirect after success
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <div className="container-fluid bg-secondary min-vh-100 py-4">

                <div className="container mb-4">
                    <div className="d-flex justify-content-between">
                        <h2 className="fw-bold text-center text-light">Add Activity</h2>
                        <button onClick={() => navigate(-1)} className="btn btn-sm btn-primary">
                            <ArrowLeft size={18} className="bg-info mb-1 me-1 rounded-2"/>
                            Back
                        </button>
                    </div>
                </div>

                <div className="container mb-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-3">
                                {/* Activity Type */}
                                <div className="mb-3">
                                    <label className="form-label">Activity Type</label>
                                    <select className="form-select" value={Activity.type || ""} onChange={(e) => setActivity({ ...Activity , type: e.target.value })}>
                                        <option value="">Select type</option>
                                        <option value="RUNNING">RUNNING</option>
                                        <option value="WALKING">WALKING</option>
                                        <option value="CYCLING">CYCLING</option>
                                        <option value="SWIMMING">SWIMMING</option>
                                        <option value="YOGA">YOGA</option>
                                        <option value="CARDIO">CARDIO</option>
                                        <option value="STRETCHING">STRETCHING</option>
                                        <option value="GYM">GYM</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                {/* Duration */}
                                <div className="mb-3">
                                    <label className="form-label">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter duration"
                                        value={Activity.duration}
                                        onChange={(e) => setActivity({ ...Activity, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                {/* Calories */}
                                <div className="mb-3">
                                    <label className="form-label">Calories Burned</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter calories burned"
                                        value={Activity.caloriesBurned}
                                        onChange={(e) => setActivity({ ...Activity,  caloriesBurned: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                {/* Start Time */}
                                <div className="mb-3">
                                    <label className="form-label">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={Activity.startTime}
                                        onChange={(e) => setActivity({ ...Activity, startTime: e.target.value })}
                                    />
                                </div>
                            </div>    

                            {/* Additional additionalMetrics */}
                            <div className="mb-3">
                                <label className="form-label">Additional additionalMetrics</label>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. heartRate)"
                                            value={metricInput[0].key}
                                            onChange={(e) => {
                                                const updated = [...metricInput];
                                                updated[0].key = e.target.value;
                                                setMetricInput(updated)
                                            }}
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 120)"
                                            value={metricInput[0].value}
                                             onChange={(e) => {
                                                const updated = [...metricInput];
                                                updated[0].value = e.target.value;
                                                setMetricInput(updated);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. steps)"
                                            value={metricInput[1].key}
                                            onChange={(e) => 
                                            {
                                                const updated = [...metricInput];
                                                updated[1].key = e.target.value;
                                                setMetricInput(updated)
                                            }
                                            }
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 120)"
                                            value={metricInput[1].value}
                                            onChange={(e) => 
                                            {
                                                const updated = [...metricInput];
                                                updated[1].value = e.target.value;
                                                setMetricInput(updated)
                                            }
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. speed)"
                                            value={metricInput[2].key}
                                            onChange={(e) => 
                                            {
                                                const updated = [...metricInput];
                                                updated[2].key = e.target.value;
                                                setMetricInput(updated)
                                            }
                                            }
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 10 or 20)"
                                            value={metricInput[2].value}
                                            onChange={(e) => 
                                                 {
                                                const updated = [...metricInput];
                                                updated[2].value = e.target.value;
                                                setMetricInput(updated)
                                            }
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. distance)"
                                            value={metricInput[3].key}
                                            onChange={(e) => 
                                            {
                                                const updated = [...metricInput];
                                                updated[3].key = e.target.value;
                                                setMetricInput(updated)
                                            }
                                            }
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 1 or 2 or 3 km)"
                                             value={metricInput[3].value}
                                            onChange={(e) => 
                                            {
                                                const updated = [...metricInput];
                                                updated[3].value = e.target.value;
                                                setMetricInput(updated)
                                            }
                                            }
                                        />
                                    </div>
                                </div>

                                <small className="text-muted">
                                    Add custom additionalMetrics like heart rate, steps, speed etc.
                                </small>
                            </div>

                            {/* Submit Button */}
                            <button className="btn btn-primary mt-3 ms-3" style={{ width: "110px" }}>
                                <Send size={18} className="bg-info mb-1 me-1 rounded-2"/>
                                Submit
                            </button>
                        </div>    
                    </form>
                </div>

            </div>
        </>
    );
};

export default AddActivity;