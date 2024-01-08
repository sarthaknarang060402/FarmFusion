import React, { useState } from "react";
import { Navbar } from "../components";
import axios from "axios";
import HtmlRenderer from "../components/HtmlRenderer";

const FertilizerRecommendation = () => {
    const [recommendation, setRecommendation] = useState("");
    const [formData, setFormData] = useState({
        nitrogen: null,
        phosphorous: null,
        pottasium: null,
        cropname: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axios.post("http://localhost:5000/fertilizer", formData)
            .then((res) => {
                console.log(res.data);
                setRecommendation(res.data.reccommendation);
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
                        <h1 className="text-center">Fertilizer Recommendation</h1>
                        {recommendation === "" ? <>
                            <div className="col-md-6 col-sm-12">
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
                                        <label htmlFor="cropname" className="form-label">
                                            Crop Name
                                        </label>
                                        <select name="cropname" id="cropname" className="form-select" onChange={handleChange}>
                                                        <option selected>Select Crop</option>
                                                        <option value="rice">rice</option>
                                                        <option value="maize">maize</option>
                                                        <option value="chickpea">chickpea</option>
                                                        <option value="kidneybeans">kidneybeans</option>
                                                        <option value="pigeonpeas">pigeonpeas</option>
                                                        <option value="mothbeans">mothbeans</option>
                                                        <option value="mungbean">mungbean</option>
                                                        <option value="blackgram">blackgram</option>
                                                        <option value="lentil">lentil</option>
                                                        <option value="pomegranate">pomegranate</option>
                                                        <option value="banana">banana</option>
                                                        <option value="mango">mango</option>
                                                        <option value="grapes">grapes</option>
                                                        <option value="watermelon">watermelon</option>
                                                        <option value="muskmelon">muskmelon</option>
                                                        <option value="apple">apple</option>
                                                        <option value="orange">orange</option>
                                                        <option value="papaya">papaya</option>
                                                        <option value="coconut">coconut</option>
                                                        <option value="cotton">cotton</option>
                                                        <option value="jute">jute</option>
                                                        <option value="coffee">coffee</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Recommend
                                    </button>
                                </form>
                            </div>
                        </> :
                            <>
                                <div className="col-md-8 col-sm-12">
                                    <div className="container my-3 py-3">
                                        <HtmlRenderer htmlCode={recommendation} />
                                    </div>
                                </div>
                            </>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FertilizerRecommendation;
