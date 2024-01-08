import React, { useEffect, useState } from 'react'
import { Footer, Navbar } from '../components'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart } from '../utils/cart'
import toast from 'react-hot-toast'
import { verifyToken } from '../utils/auth'
import Cookies from 'js-cookie'

const CheckSoil = () => {
    const soilInspectionProduct = {
        "_id": "6553c905b1078349ed567e49",
        "id": "4eeaf967d2",
        "name": "Soil Inspection",
        "price": 499,
        "description": "Get Your Soil tested by our experts.",
        "image": "https://i.postimg.cc/gkyK5PwR/soil-inspection.png",
        "type": "product",
        "createdBy": "admin",
        "rating": 0,
        "__v": 0
    }

    const navigate = useNavigate()
    const [user, setUser] = useState({})

    useEffect(() => {
        async function getUser(token) {
            let response = await verifyToken(token)
            if (!response.success) {
                console.log(response.message)
                navigate("/login")
            } else {
                setUser(response)
            }
        }

        let token = Cookies.get("auth")
        getUser(token)

    }, [navigate])
    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <div className="container">
                    <div className="row gap-2 justify-content-center h-full">
                        <div className="col-md-3 py-5 px-3 bg-light text-center rounded">
                            <Link to="/crop-recommendation" className='btn'>
                                <img src="https://i.postimg.cc/gkyK5PwR/soil-inspection.png" alt="" className='img-fluid'></img>
                                <p className='mt-2 fs-5'>Crop Recommendation</p>
                            </Link>
                        </div>
                        <div className="col-md-3 py-5 px-3 bg-light text-center rounded">
                            <Link to="/fertilizer-recommendation" className='btn'>
                                <img src="https://i.postimg.cc/gkyK5PwR/soil-inspection.png" alt="" className='img-fluid'></img>
                                <p className='mt-2 fs-5'>Fertilizer Recommendation</p>
                            </Link>
                        </div>
                        <div className="col-md-3 py-5 px-3 bg-light text-center rounded">
                            <button className='btn' onClick={async () => {
                                let res = await addToCart(user.userId, soilInspectionProduct)
                                toast(res)
                                navigate("/cart")
                            }}>
                                <img src="https://i.postimg.cc/gkyK5PwR/soil-inspection.png" alt="" className='img-fluid'></img>
                                <p className='mt-2 fs-5'>Soil Inspection</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CheckSoil