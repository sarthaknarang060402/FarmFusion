import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { verifyToken } from "../utils/auth";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])

    const logout = () => {
        Cookies.remove("auth")
        navigate("/login")
    }

    const becomeASeller = () => {
        axios.post('http://localhost:8080/api/user/becomeaseller', { userId: user.userId })
            .then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    // setUser({ ...user, type: "seller" })
                    toast.success(res.data.message)
                    navigate('/login')
                }
                else {
                    toast.error(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error("Something went wrong")
            })
    }
    useEffect(() => {
        async function getUser(token) {
            let response = await verifyToken(token)
            if (!response.success) {
                console.log(response.message)
                navigate("/login")
            } else {
                setUser(response)
            }
        }

        async function getProductFromUserId(userId) {
            let response = await axios.get(`http://localhost:8080/api/products/user/${userId}`)
            if (response.data.success) {
                console.log(response.data.products)
                setProducts(response.data.products)
            }
            else {
                console.log(response.data.message)
            }
        }

        async function getOrdersFromUserId(userId) {
            let response = await axios.get(`http://localhost:8080/api/orders/seller/${userId}`)
            if (response.data.success) {
                console.log(response.data.orders)
                setOrders(response.data.orders)
            }
            else {
                console.log(response.data.message)
            }
        }
        let token = Cookies.get("auth")
        getUser(token)

        getProductFromUserId(user.userId)
        getOrdersFromUserId(user.userId)
    }, [navigate, user.userId])
    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <div className="container">
                    <div className="row">
                        <section>
                            <div className="container py-5">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="card mb-4">
                                            <div className="card-body text-center">
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                                                    className="rounded-circle img-fluid" style={{ width: "100px" }} />
                                                <h5 className="my-3">{user.name}</h5>
                                                {user.type === "consumer" && <>
                                                    <div className="d-flex justify-content-center mb-2">
                                                        <button type="button" onClick={becomeASeller} className="btn btn-sm btn-success rounded-pill">Become A Seller</button>
                                                    </div>
                                                </>}
                                                {user.type === "seller" && <>
                                                    <div className="d-flex justify-content-center my-2">
                                                        <button type="button" className="btn btn-sm btn-success rounded-pill" onClick={() => navigate('/addproduct')}>
                                                            Add a Product
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-success rounded-pill ms-1" onClick={() => navigate('/addcrop')}>Add a Crop</button>
                                                    </div>
                                                </>}
                                                <div className="d-flex justify-content-center mb-2">
                                                    <button type="button" onClick={logout} className="btn text-decoration-underline rounded-pill ms-1">Logout</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="card mb-4">
                                            <div className="card-body p-0">
                                                <div className="d-flex justify-content-center my-2">
                                                    <button type="button" className="btn btn-success rounded-pill">Add a Product</button>
                                                    <button type="button" className="btn btn-success rounded-pill ms-1">Add a Crop</button>
                                                </div>
                                                <ul className="list-group list-group-flush rounded-3">
                                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                        <i className="fas fa-globe fa-lg text-warning"></i>
                                                        <p className="mb-0">https://mdbootstrap.com</p>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                        <i className="fab fa-github fa-lg" ></i>
                                                        <p className="mb-0">mdbootstrap</p>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                        <i className="fab fa-twitter fa-lg" ></i>
                                                        <p className="mb-0">@mdbootstrap</p>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                        <i className="fab fa-instagram fa-lg" ></i>
                                                        <p className="mb-0">mdbootstrap</p>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                        <i className="fab fa-facebook-f fa-lg"></i>
                                                        <p className="mb-0">mdbootstrap</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="card mb-4">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <p className="mb-0">Name</p>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <p className="text-muted mb-0">{user.name}</p>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <p className="mb-0">Email</p>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <p className="text-muted mb-0">{user.email}</p>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <p className="mb-0">Type</p>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <p className="text-muted mb-0">{user.type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {user.type === "seller" && <>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="card mb-4 mb-md-0">
                                                        <div className="card-body">
                                                            <p className="mb-4"><span className="text-success fs-5 me-1">My Products</span></p>
                                                            {products.length > 0 ? products.map((product) => (<p>{product.name}</p>)) : <p>No products Found</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card mb-4 mb-md-0">
                                                        <div className="card-body">
                                                            <p className="mb-4"><span className="text-success fs-5 me-1">My Pending Orders</span></p>
                                                            {orders.length > 0 ? orders.map((order) => (<p>{order.name}</p>)) : <p>No Pending Order Found</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div >
            </div >

            <Footer />
        </>
    );
};

export default Profile;
