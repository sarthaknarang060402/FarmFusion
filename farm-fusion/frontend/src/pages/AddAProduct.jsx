import React, { useEffect, useState } from "react";
import { Navbar } from "../components";
import { verifyToken } from "../utils/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddAProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: null,
    image: null,
    createdBy: "",
    type: "product",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
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
              <h1 className="text-center">Add A Product</h1>
              {error ? (
                <>
                  <p className="text-center mt-3 fs-5 text-danger">{error}</p>
                </>
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label htmlFor="name" className="form-label">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
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
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        placeholder="Add the Price for the Product"
                        max={1000000}
                        min={0}
                        value={formData.price}
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
                        onChange={handleChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAProduct;
