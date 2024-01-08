import axios from "axios";

const verifyToken = async (token) => {
    const res = await axios.post("http://localhost:8080/api/auth/verify-token", { token })

    return res.data
}

export { verifyToken }