import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiry: "",
  });

  const navigate = useNavigate();
  const [contactModal, setContactModal] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_hmqc9w1",
        "template_lbq9w3i",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.inquiry,
        },
        "1kY36-1khSisonEbr"
      );

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", inquiry: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {contactModal && (
        <div
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-1 sm:p-6 md:p-8"
          style={{
            backgroundImage:
              "url(https://liamcrest.com/assets/static/header/Asset%2072.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Toaster position="top-center" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-xl w-[95%] sm:w-full mx-auto relative"
          >
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setContactModal(false);
                navigate("/home");
              }}
              className="absolute -right-2 sm:-right-4 -top-4 sm:-top-4 w-12 h-12 sm:w-12 sm:h-12 bg-[#1a237e] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2a337e] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            <div className="flex flex-col space-y-4 sm:space-y-6">
              <div className="w-full">
                <h2 className="text-3xl sm:text-3xl font-bold text-[#1a237e] text-center mb-2 sm:mb-4 pt-8">
                  Connect With Us!
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400 "
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400"
                  />
                </div>

                <div>
                  <textarea
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    placeholder="Your Message..."
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all resize-none text-[#1a237e] placeholder-gray-400"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#1a237e] text-white font-semibold py-2.5 sm:py-3 rounded-xl hover:bg-[#1a237e] transition-all text-base sm:text-lg hover:shadow-lg"
                >
                  Let's Talk
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
