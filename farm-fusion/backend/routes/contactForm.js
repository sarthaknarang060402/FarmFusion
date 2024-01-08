import express from "express";
import {
    createContactForm
} from "../controllers/contactForm.js";

const router = express.Router();

router.post("/", createContactForm); // Add an item to the cart

export default router;
