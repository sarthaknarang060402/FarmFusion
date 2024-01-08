import axios from "axios"

const addToCart = async (userId, product) => {
    const res = await axios.post("http://localhost:8080/api/cart/add", {
        user: userId,
        itemType: product.type,
        itemId: product._id,
        quantity: 1,
        price: product.price
    })
    console.log(res.data)
    return res.data.message
}

const getCartByUser = async (userId) => {
    const res = await axios.get(`http://localhost:8080/api/cart/${userId}`)

    return res.data
}

const changeQuantity = async (userId, product, quantity) => {
    const res = await axios.post(`http://localhost:8080/api/cart/changeQuantity`, {
        user: userId,
        itemId: product._id,
        itemType: product.type,
        quantityChange: Number(quantity)
    })

    return res.data
}

export { addToCart, getCartByUser, changeQuantity }