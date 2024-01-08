import axios from "axios";

const getSingleProduct = async (productId) => {
    const res = await axios.get(`http://localhost:8080/api/products/${productId}`)

    return res.data
}

export { getSingleProduct }