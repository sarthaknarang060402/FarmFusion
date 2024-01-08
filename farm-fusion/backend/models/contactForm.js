import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
});

const ContactForm = mongoose.model("ContactForm", contactFormSchema);
export default ContactForm;