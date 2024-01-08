import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyToken } from "../utils/auth";
import { getCartByUser } from "../utils/cart";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { confirmOrder } from "../utils/order";
const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("")
  const [cartInfo, setCartInfo] = useState({})

  useEffect(() => {
    async function getCart(token) {
      let response = await verifyToken(token)
      if (!response.success) {
        console.log(response.message)
        navigate("/login")
      } else {
        setUserId(response.userId)
        let cart = await getCartByUser(response.userId)

        console.log(cart)
        if (!cart.success) {
          if (cart.cart !== null) {
            // setError(cart.message)
          }
        }
        else {

          setCartInfo({
            totalTax: cart.cart.totalTax,
            totalAmount: cart.cart.totalAmount
          })
          setCartItems(cart.cart.items)
        }
      }
    }

    let token = Cookies.get("auth")
    if (!token) {
      toast("Please Login first");
      navigate("/login")
    } else {
      getCart(token)
    }
  }, [navigate, params, userId])

  useEffect(() => {

    async function confirmOrderOne(userId, cartItems, totalAmount) {
      let res = await confirmOrder(userId, cartItems, totalAmount)
      if (res.success) {
        toast.success("Order Confirmed")
      }
      else {
        toast.error("Something went wrong")
      }
    }

    if (!params.get("success") && !params.get("session_id")) {
      window.location.href = "/"
    }
    else {
      console.log("hello")
      confirmOrderOne(userId, cartItems, cartInfo.totalAmount)
    }
  }, [params, cartItems, cartInfo.totalAmount, userId, navigate])
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3 text-center">
        <h1 className="">Order Confirmed</h1>
        <hr />
        <p className="mt-4 fs-5">Please Check the <Link to="/order">Orders</Link> page for more information</p>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
