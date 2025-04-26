import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function StudentLogin() {
  const [isOpen, setIsOpen] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://iba-nceac.onrender.com/api/auth/student-login",
        { studentId, password }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        setMessage("Login successful");
        localStorage.setItem("token", response.data.token);
        navigate(`/student/${response.data.object_id}`);
      } else {
        setSubmitSuccess(false);
        setMessage(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      setSubmitSuccess(false);
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://iba-nceac.onrender.com/api/auth/forgot-password",
        {
          email,
          userType: "student",
        }
      );

      setSubmitSuccess(true);
      setMessage(response.data.message);
    } catch (error) {
      setSubmitSuccess(false);
      setMessage(error.response?.data?.message || "Error sending reset link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstructorLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="absolute inset-0 backdrop-blur"></div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center p-4"
          style={{
            backgroundImage:
              "url(https://liamcrest.com/assets/static/header/Asset%2072.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full relative shadow-lg"
          >
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsOpen(false);
                navigate("/home");
              }}
              className="absolute -right-4 -top-4 w-12 h-12 bg-[#1a237e] text-white rounded-full flex items-center justify-center shadow-lg"
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

            <div className="flex flex-col space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src="https://liamcrest.com/assets/static/CONTACT%20US%20IMAGE-N1-01.png"
                  alt="Illustration of people communicating"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <h2 className="text-3xl font-bold text-center text-[#1a237e]">
                {showForgotPassword ? "Reset Password" : "Student Login"}
              </h2>

              {showForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1a237e] text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-colors text-lg"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </motion.button>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="text-blue-600 hover:underline text-sm w-full text-center"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Student ID (e.g., 123-45-6789)"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400"
                        required
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                        title="Please enter ID in ###-##-#### format"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400"
                        required
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1a237e] text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-colors text-lg"
                    >
                      {isSubmitting ? "Logging in..." : "Login as Student"}
                    </motion.button>
                  </form>

                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[#1a237e] hover:underline text-sm"
                    >
                      Forgot Password?
                    </button>
                    <button
                      onClick={handleInstructorLoginRedirect}
                      className="text-[#1a237e] hover:underline text-sm border-b-[1px]"
                    >
                      Login as Instructor instead
                    </button>
                  </div>
                </>
              )}

              {submitSuccess === true && (
                <p className="text-green-500 mt-4 text-center">{message}</p>
              )}
              {submitSuccess === false && (
                <p className="text-red-500 mt-4 text-center">{message}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default StudentLogin;
