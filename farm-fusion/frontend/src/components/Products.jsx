import axios from "axios";
import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import { verifyToken } from "../utils/auth";
import Cookies from "js-cookie";

const Products = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  // const [toast, setToast] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const prodResp = await axios.get(`http://localhost:8080/api/products`)

        if (!prodResp.data.success) {
          setError(prodResp.data.message)
          toast.error(prodResp.data.message)
        }
        else {
          console.log(prodResp.data)
          // toast.success("Hurray!!")
          setData(prodResp.data.products)
        }
        setLoading(false)
      }
      catch (err) {
        console.log(err)
        setError("Something went wrong!!")
        setLoading(false)
      }
    }

    async function getUser(token) {
      let response = await verifyToken(token)
      if (!response.success) {
        console.log(response.message)
        navigate("/login")
      } else {
        setUserId(response.userId)
      }
    }

    let token = Cookies.get("auth")
    fetchData()
    getUser(token)
  }, [navigate])

  const ShowProducts = () => {
    console.log(data[2])
    return (
      <>
        {data && data.map((product) => {
          return (
            <div id={product.id} key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.name.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">₹ {product.price}</li>
                </ul>
                <div className="card-body">
                  <Link to={"/product/" + product.id} className="btn btn-dark m-1">
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={async () => {
                      let res = await addToCart(userId, product)
                      toast(res)
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products/Services</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {error !== "" && <p className="fs-4 text-center text-danger">{error}</p>}
          {loading ? <p className="fs-4 text-center text-warning">Loading ...</p> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
