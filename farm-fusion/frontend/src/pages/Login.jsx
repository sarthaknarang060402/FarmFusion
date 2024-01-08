import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signin", {
        email,
        password,
      });
      console.log("Login response", response.data);

      if (response.data.success) {
        toast.success("Login Successful")
        Cookies.set("auth", response.data.token)
        navigate('/')
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("Login failed", error);
      toast.error("Something went wrong!!")
    }
  };
  // return (
  //   <>
  //     <Navbar />
  //     <div className="container my-3 py-3">
  //       <h1 className="text-center">Login</h1>
  //       <hr />
  //       <div className="row my-4 h-100">
  //         <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
  //           <form>
  //             <div className="my-3">
  //               <label htmlFor="display-4">Email address</label>
  //               <input
  //                 type="email"
  //                 className="form-control"
  //                 id="floatingInput"
  //                 placeholder="name@example.com"
  //               />
  //             </div>
  //             <div className="my-3">
  //               <label htmlFor="floatingPassword display-4">Password</label>
  //               <input
  //                 type="password"
  //                 className="form-control"
  //                 id="floatingPassword"
  //                 placeholder="Password"
  //               />
  //             </div>
  //             <div className="my-3">
  //               <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
  //             </div>
  //             <div className="text-center">
  //               <button className="my-2 mx-auto btn btn-dark" type="submit" disabled>
  //                 Login
  //               </button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //     <Footer />
  //   </>
  // );.
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div className="my-3">
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
              <div className="my-3">
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
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link to="/register" className="text-decoration-underline text-info">
                    Register
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={handleSubmit}>
                  Login
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

export default Login;
