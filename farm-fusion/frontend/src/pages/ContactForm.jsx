import React, { useState } from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from '../components';

const ContactForm = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/contactform", formData);
            console.log("Contact response", response.data);

            if (response.data.success) {
                setFormData({
                    name: "",
                    email: "",
                    message: ""
                })
                toast.success("Contact Successful")
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log("Failed", error);
            toast.error("Something went wrong!!")
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-sm-12">
                            <h1 className="text-center">Contact Us</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label htmlFor="name" className="form-label">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="message" className="form-label">
                                        Message
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        placeholder="Type your message/query"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactForm;
