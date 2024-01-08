import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";
import { verifyToken } from "../utils/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getOrdersByUser } from "../utils/order";
const Checkout = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    useEffect(() => {
        let token = Cookies.get("auth")

        async function getOrders(token) {
            let responseToken = await verifyToken(token)
            if (!responseToken.success) {
                console.log(responseToken.message)
                navigate("/login")
            } else {
                let userId = responseToken.userId

                let response = await getOrdersByUser(userId)

                if (!response.success) {
                    toast.error(response.message)
                } else {
                    console.log(response.orders)
                    setOrders(response.orders)
                }
            }
        }
        getOrders(token)
    }, [navigate,])
    return (
        <>
            <Navbar />
            <div className="container my-3 py-3 text-center">
                <h1 className="">Orders</h1>
                <hr />
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Order ID</th>
                                <th scope="col">Order Date</th>
                                <th scope="col">No. of Items</th>
                                <th scope="col">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{order.id}</td>
                                        <td>{(new Date(order.orderDate)).toLocaleDateString()}</td>
                                        <td>{order.items.length}</td>
                                        <td>{order.totalAmount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
