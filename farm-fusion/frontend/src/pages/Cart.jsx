import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { changeQuantity, getCartByUser } from "../utils/cart";
import { verifyToken } from "../utils/auth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
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
          if (cart.cart !== null)
            setError(cart.message)
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
  }, [navigate])

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Your Cart is Empty</h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCart = () => {
    console.log(userId)
    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Item List</h5>
                  </div>
                  <div className="card-body">
                    {cartItems.map((item, index) => {
                      return (
                        <div key={index}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={item.itemId.image}
                                  // className="w-100"
                                  alt={item.title}
                                  width={100}
                                  height={75}
                                />
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p>
                                <strong>{item.itemId.name}</strong>
                              </p>
                              {/* <p>Color: blue</p>
                              <p>Size: M</p> */}
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div
                                className="d-flex mb-4"
                                style={{ maxWidth: "300px" }}
                              >
                                <button
                                  className="btn px-3"
                                  onClick={async () => {
                                    let res = await changeQuantity(userId, item.itemId, -1)
                                    toast(res.message)
                                    setCartInfo({
                                      totalAmount: res.cart.totalAmount,
                                      totalTax: res.cart.totalTax,
                                    })
                                    setCartItems(res.cart.items)
                                  }}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>

                                <p className="mx-5">{item.quantity}</p>

                                <button
                                  className="btn px-3"
                                  onClick={async () => {
                                    let res = await changeQuantity(userId, item.itemId, 1)
                                    toast(res.message)
                                    setCartInfo({
                                      totalAmount: res.cart.totalAmount,
                                      totalTax: res.cart.totalTax,
                                    })
                                    setCartItems(res.cart.items)
                                  }}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>

                              <p className="text-start text-md-center">
                                <strong>
                                  <span className="text-muted">{item.quantity}</span>{" "}
                                  x ₹ {item.itemId.price} = {item.quantity * item.itemId.price}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <hr className="my-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>₹{cartInfo.totalAmount}</strong>
                        </span>
                      </li>
                    </ul>

                    <button
                      className="btn btn-dark btn-lg btn-block"
                      onClick={async () => {
                        let res = await axios.post('http://localhost:8080/api/checkout', { cart: cartItems })
                        console.log(res.data)
                        if (res.data.success) {
                          window.location.href = res.data.url
                        }
                        else {
                          toast.error(res.data.message)
                        }
                      }}
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {error !== "" ? <p className="fs-4 text-center text-danger">{error}</p> : (cartItems.length > 0 ? <ShowCart /> : <EmptyCart />)}
        {/* {cartItems.length > 0 ? <ShowCart /> : <EmptyCart />} */}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
