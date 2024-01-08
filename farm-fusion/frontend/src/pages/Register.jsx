import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        type: "consumer"
    });

    const { name, email, password } = formData;

    const handleChange = (e) => {
        console.log(formData)
        // console.log(e.target.name, e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/auth/signup", {
                name,
                email,
                password,
            });

            console.log("Registration response", response.data);

            if (response.data.success) {
                toast.success("Registration Successful")
                navigate("/login")
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error("Registration failed", error);
            toast.error("Something went wrong!!")
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form>
                            <div className="form my-3">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                    placeholder="Enter Your Name"
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div className="form  my-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                            </div>
                            <div className="form  my-3">
                                <label htmlFor="type">Type</label>
                                <select name="type" className="form-select" onChange={handleChange}>
                                    <option selected value="consumer">Consumer</option>
                                    <option value="seller">Seller</option>
                                </select>
                            </div>
                            <div className="my-3">
                                <p>
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-decoration-underline text-info">
                                        Login
                                    </Link>{" "}
                                </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={handleSubmit}>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
