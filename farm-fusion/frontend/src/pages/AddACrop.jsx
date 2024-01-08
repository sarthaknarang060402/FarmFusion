import React, { useEffect, useState } from "react";
import { Navbar } from "../components";
import axios from "axios";
import { verifyToken } from "../utils/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddACrop = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [quality, setQuality] = useState("");
    const [price, setPrice] = useState("");
    const handleChange = (e) => {
        if (e.target.name ==="price")setPrice(e.target.value)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        setImage(e.target.files[0]);
    };

    const GetQuality = (e) => {
        e.preventDefault();
        // console.log(image)
        const formdata = new FormData()
        formdata.append('image', image)
        axios.post("http://127.0.01:5000/crop-classification", formdata).then((res) => {
            console.log(res.data);
            setQuality(res.data.predicted_class_name);
        }).catch((err) => {
            console.log(err);
        })
    }

    const SuggestPrice = (e) => {
        e.preventDefault();
        console.log(formData);
        formData.quality = quality;
        axios.post("http://127.0.01:5000/crop-price", formData).then((res) => {
            console.log(res.data);
            setPrice(Math.round(res.data.predicted_price))
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = {
            name: formData.name,
            description: formData.description,
            price: price,
            createdBy: user.userId,
            type: "product",
            image: await convertImageToBase64(formData.image),
        };

        axios
            .post("http://localhost:8080/api/products", formDataToSend)
            .then((res) => {
                if (res.data.success) {
                    navigate("/profile");
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const convertImageToBase64 = (imageFile) => {
        return new Promise((resolve, reject) => {
            if (!imageFile) {
                resolve(null);
            }

            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(imageFile);
        });
    };

    useEffect(() => {
        async function getUser(token) {
            let response = await verifyToken(token);
            if (!response.success) {
                // console.log(response.message);
                console.log(response);
                // navigate("/login")
            } else {
                setUser(response);
                if (response.type !== "seller") {
                    setError("You are not a seller");
                }
                console.log(response);
            }
        }
        let token = Cookies.get("auth");
        getUser(token);
    }, []);
    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-sm-12">
                            <h1 className="text-center">Add A Crop</h1>
                            {error ? (
                                <>
                                    <p className="text-center mt-3 fs-5 text-danger">{error}</p>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <label htmlFor="name" className="form-label">
                                                Crop Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                placeholder="Enter Crop Name"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="description" className="form-label">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="description"
                                                name="description"
                                                placeholder="Add product Description"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="image" className="form-label">
                                                Image
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="image"
                                                name="image"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        {quality === "" ? <button className="btn btn-primary mb-2" onClick={GetQuality}>Predict Quality</button> :
                                            <>
                                                <div className="mb-2">
                                                    <label htmlFor="quality" className="form-label">
                                                        Crop Quality
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="quality"
                                                        name="quality"
                                                        // placeholder="Enter product name"
                                                        value={quality}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="month" className="form-label">
                                                        Month
                                                    </label>
                                                    <select name="month" id="month" className="form-select" onChange={handleChange}>
                                                        <option selected>Select Month</option>
                                                        <option value="January">January</option>
                                                        <option value="February">February</option>
                                                        <option value="March">March</option>
                                                        <option value="April">April</option>
                                                        <option value="May">May</option>
                                                        <option value="June">June</option>
                                                        <option value="July">July</option>
                                                        <option value="August">August</option>
                                                        <option value="September">September</option>
                                                        <option value="October">October</option>
                                                        <option value="November">November</option>
                                                        <option value="December">December</option>
                                                    </select>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="state" className="form-label">
                                                        State
                                                    </label>
                                                    <select name="state" id="state" className="form-select" onChange={handleChange}>
                                                        <option selected>Select</option>
                                                        <option value="Assam">Assam</option>
                                                        <option value="Bihar">Bihar</option>
                                                        <option value="Haryana">Haryana</option>
                                                        <option value="Jharkhand">Jharkhand</option>
                                                        <option value="Meghalaya">Meghalaya</option>
                                                        <option value="Mizoram">Mizoram</option>
                                                        <option value="Nagaland">Nagaland</option>
                                                        <option value="Punjab">Punjab</option>
                                                        <option value="Sikkim">Sikkim</option>
                                                        <option value="Tripura">Tripura</option>
                                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                        <option value="West Bengal">West Bengal</option>
                                                    </select>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="soil_type" className="form-label">
                                                        Soil type
                                                    </label>
                                                    <select name="soil_type" id="soil_type" className="form-select" onChange={handleChange}>
                                                        <option selected>Select</option>
                                                        <option value="Alluvial soil">Alluvial soil</option>
                                                        <option value="Black soil">Black soil</option>
                                                        <option value="Clay loam">Clay loam</option>
                                                        <option value="Clay soil">Clay soil</option>
                                                        <option value="Laterite soil">Laterite soil</option>
                                                        <option value="Peaty soil">Peaty soil</option>
                                                        <option value="Red soil">Red soil</option>
                                                        <option value="Sandy loam">Sandy loam</option>
                                                        <option value="Sandy soil">Sandy soil</option>
                                                    </select>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="seed_type" className="form-label">
                                                        Seed type
                                                    </label>
                                                    <select name="seed_type" id="seed_type" className="form-select" onChange={handleChange}>
                                                        <option selected>Select</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                        <option value="Open-pollinated">Open-pollinated</option>
                                                    </select>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="weather_condition" className="form-label">
                                                        Weather condition
                                                    </label>
                                                    <select name="weather_condition" id="weather_condition" className="form-select" onChange={handleChange}>
                                                        <option selected>Select</option>
                                                        <option value="Cold and dry">Cold and dry</option>
                                                        <option value="Hot and dry">Hot and dry</option>
                                                        <option value="Hot and humid">Hot and humid</option>
                                                        <option value="Monsoon">Monsoon</option>
                                                        <option value="Warm and dry">Warm and dry</option>
                                                    </select>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="irrigation" className="form-label">
                                                        Irrigation
                                                    </label>
                                                    <select name="irrigation" id="irrigation" className="form-select" onChange={handleChange}>
                                                        <option selected>Select</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                    </select>
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="fertilizer_usage" className="form-label">
                                                        Fertilizer Usage
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="fertilizer_usage"
                                                        name="fertilizer_usage"
                                                        placeholder="Enter Fertilizer Usage"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="pesticide_usage" className="form-label">
                                                        Pesticide Usage
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="pesticide_usage"
                                                        name="pesticide_usage"
                                                        placeholder="Enter pesticide usage"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <button className="btn btn-primary" onClick={SuggestPrice}>
                                                    Suggest Price
                                                </button>

                                                {price !== "" && <div className="mb-2">
                                                    <label htmlFor="price" className="form-label">
                                                        Price
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="price"
                                                        name="price"
                                                        value={price}
                                                        placeholder="Add the Price for the Product"
                                                        onChange={handleChange}
                                                    />
                                                </div>}

                                            </>
                                        }

                                        {price !== "" && <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>}

                                    </form>
                                </>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddACrop;
