import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { verifyToken } from '../utils/auth'
import Select from "react-select";
import axios from 'axios';

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate()

    const handleClick = () => {
        if (!selectedOption) {
            console.log('required');
        } else {
            console.log(selectedOption.value);
            navigate('/product/' + selectedOption.value)
        }
    };

    const onChangeHandler = (value) => {
        axios
            .get(
                `http://localhost:8080/api/products/search?q=${value}`,
            )
            .then((res) => {
                if (res.data.success) {

                    console.log(res.data.products);
                    setSuggestions(res.data.products);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        console.log(`Option selected:`, selectedOption)
        navigate('/product/' + selectedOption.value)
    };

    const handleSelectBlur = () => {
        setSuggestions([]);
    };

    useEffect(() => {
        async function getUser(token) {
            let response = await verifyToken(token)
            if (!response.success) {
                console.log(response.message)
                // navigate("/login")
            } else {
                setLoggedIn(true)
            }
        }
        let token = Cookies.get("auth")
        getUser(token)
    }, [navigate])
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">Farm Fusion</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        {/* <input className="form-control me-2 rounded-pill" type="search" placeholder="Search for products" aria-label="Search" /> */}
                        {loggedIn &&
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderRadius: "30px",
                                        marginRight: "10px",
                                        minWidth: "180px",
                                    }),
                                    placeholder: (baseStyles, state) => ({
                                        ...baseStyles,
                                        marginLeft: "0px",
                                    }),
                                    dropdownIndicator: (baseStyles, state) => ({
                                        ...baseStyles,
                                        display: "none",
                                    }),
                                }}
                                placeholder="Search for products"
                                name="search"
                                noOptionsMessage={() => "No products found"}
                                onChange={handleSelectChange}
                                onBlur={handleSelectBlur}
                                onInputChange={onChangeHandler}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleClick();
                                }}
                                options={suggestions.map((suggestion) => ({
                                    value: suggestion.id,
                                    label: suggestion.name,
                                }))}
                                isOptionSelected={(option) => {
                                    console.log(selectedOption?.value === option.value)
                                    return selectedOption?.value === option.value
                                }}
                            />
                        }
                    </ul>
                    <div className="buttons text-center">
                        <NavLink to="/cart" className="btn rounded-pill"><i className="fa fa-cart-shopping mr-1"></i></NavLink>
                        {loggedIn ? <>
                            <NavLink to="/profile" className="btn rounded-pill"><i className="fa fa-user mr-1"></i></NavLink>
                        </>
                            :
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2 rounded-pill"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2 rounded-pill"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>

                            </>
                        }
                        <NavLink to="/checksoil" className="btn btn-success m-2 rounded-pill"><i className="fa fa-wheat-awn mr-1"></i> Check Soil </NavLink>
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar