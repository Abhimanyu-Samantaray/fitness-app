import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

const AddActivity = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="container-fluid bg-secondary min-vh-100 py-4">

                <div className="container mb-4">
                    <div className="d-flex justify-content-between">
                        <h2 className="fw-bold text-center text-light">Add Activity</h2>
                        <button onClick={() => navigate(-1)} className="btn btn-primary float-end">
                            <ArrowLeft size={18} className="bg-info mb-1 me-1 rounded-2"/>
                            Back
                        </button>
                    </div>
                </div>

                <div className="container mb-4">
                    <form>
                        <div className="row">
                            <div className="col-12 col-md-3">
                                {/* Activity Type */}
                                <div className="mb-3">
                                    <label className="form-label">Activity Type</label>
                                    <select className="form-select">
                                        <option>Select type</option>
                                        <option>RUNNING</option>
                                        <option>WALKING</option>
                                        <option>CYCLING</option>
                                        <option>SWIMMING</option>
                                        <option>YOGA</option>
                                        <option>CARDIO</option>
                                        <option>STRETCHING</option>
                                        <option>GYM</option>
                                        <option>OTHER</option>
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
                                    />
                                </div>
                            </div>    

                            {/* Additional Metrics */}
                            <div className="mb-3">
                                <label className="form-label">Additional Metrics</label>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. heartRate)"
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 120)"
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. steps)"
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 120)"
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. speed)"
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 10 or 20)"
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-4">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Key (e.g. distance)"
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Value (e.g. 1 or 2 or 3 km)"
                                        />
                                    </div>
                                </div>

                                <small className="text-muted">
                                    Add custom metrics like heart rate, steps, speed etc.
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