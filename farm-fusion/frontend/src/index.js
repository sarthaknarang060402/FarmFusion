import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import { Home, Product, Products, Cart, Login, Register, Checkout, PageNotFound, Profile, CheckSoil, AddAProduct } from "./pages"
import { Toaster } from 'react-hot-toast';
import Orders from './pages/Orders';
import AddACrop from './pages/AddACrop';
import ContactForm from './pages/ContactForm';
import CropRecommendation from './pages/CropRecommendation';
import FertilizerRecommendation from './pages/FertilizerRecommendation';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Products />} />
      <Route path="/order" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/checksoil" element={<CheckSoil />} />
      <Route path="/addproduct" element={<AddAProduct />} />
      <Route path="/addcrop" element={<AddACrop />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/crop-recommendation" element={<CropRecommendation />} />
      <Route path="/fertilizer-recommendation" element={<FertilizerRecommendation/>} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/product/*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
);