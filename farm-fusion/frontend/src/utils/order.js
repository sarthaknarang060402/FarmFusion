import axios from "axios";

const confirmOrder = async (userId, items, totalAmount) => {
    console.log("UserId in confirm order", totalAmount)
    const res = await axios.post("http://localhost:8080/api/orders", { userId, items, totalAmount })
    return res.data
}

const getOrdersByUser = async (userId) => {
    const res = await axios.get(`http://localhost:8080/api/orders/${userId}`)

    return res.data
}
export { confirmOrder, getOrdersByUser }