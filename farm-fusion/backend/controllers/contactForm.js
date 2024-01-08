import ContactForm from "../models/contactForm.js";

// Create a new contact form
const createContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const contactForm = new ContactForm({
            name,
            email,
            message,
        });

        await contactForm.save();

        res.json({
            success: true,
            message: "Contact form submitted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }
}

export {
    createContactForm,
}