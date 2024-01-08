import { useEffect } from "react";
import { Navbar, Product, Footer } from "../components";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../utils/auth";

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    async function verify(token) {
      let response = await verifyToken(token)

      if (!response.success) {
        console.log(response.message)
        navigate("/login")
      } else {
        console.log(response)
      }
    }

    let token = Cookies.get('auth');
    // console.log(token)
    if (!token) {
      navigate("/login");
    }
    else {
      verify(token);
    }
  }, [navigate])

  return (
    <>
      <Navbar />
      <Product />
      <Footer />
    </>
  )
}

export default Home