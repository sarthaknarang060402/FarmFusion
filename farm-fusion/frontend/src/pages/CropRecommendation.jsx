import React, { useState } from "react";
import { Navbar } from "../components";
import axios from "axios";

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        nitrogen: null,
        phosphorous: null,
        pottasium: null,
        moisture: null,
        temperature: null,
        city: "",
    });
    const [recommendation, setRecommendation] = useState("")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axios.post("http://localhost:5000/crop-suggestion", formData)
            .then((res) => {
                console.log(res.data);

                setRecommendation(res.data.prediction);
                // console.log(recommendation);
            }).catch((err) => {
                console.log(err)
            })
    }
    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-sm-12">
                            <h1 className="text-center">Crop Recommendation</h1>
                            {recommendation === "" ? <>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <label htmlFor="nitrogen" className="form-label">
                                            Nitrogen
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="nitrogen"
                                            name="nitrogen"
                                            placeholder="Nitrogen mg/kg"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="phosphorous" className="form-label">
                                            Phosphorous
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="phosphorous"
                                            name="phosphorous"
                                            placeholder="Phosphorous mg/kg"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="pottasium" className="form-label">
                                            Pottasium
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="pottasium"
                                            name="pottasium"
                                            placeholder="Pottasium mg/kg"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="moisture" className="form-label">
                                            Moisture
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="moisture"
                                            name="moisture"
                                            placeholder="Moisture %"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="temperature" className="form-label">
                                            Temperature
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="temperature"
                                            name="temperature"
                                            placeholder="Temperature C"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="city" className="form-label">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            placeholder="City"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Recommend
                                    </button>
                                </form>
                            </> :
                                <>
                                    <p className="text-center display-6">Recommendation: <span className="text-success text-capitalize">{recommendation}</span></p>
                                </>}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CropRecommendation;
