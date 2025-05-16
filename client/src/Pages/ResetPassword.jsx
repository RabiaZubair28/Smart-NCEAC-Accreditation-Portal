import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const userType = searchParams.get("userType");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setSubmitSuccess(false);
      setMessage("Passwords don't match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://iba-nceac.site/api/auth/reset-password",
        {
          token,
          userType,
          newPassword,
        }
      );

      setSubmitSuccess(true);
      setMessage(response.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(userType === "instructor" ? "/login" : "/student-login");
      }, 3000);
    } catch (error) {
      setSubmitSuccess(false);
      setMessage(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="absolute inset-0 backdrop-blur"></div>

      <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 max-w-md w-full relative shadow-lg"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-center mb-4">
              <img
                src="https://liamcrest.com/assets/static/CONTACT%20US%20IMAGE-N1-01.png"
                alt="Illustration of people communicating"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-[#1a237e]">
              Reset Your Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400"
                  required
                  minLength="8"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-20 transition-all text-[#1a237e] placeholder-gray-400"
                  required
                  minLength="8"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1a237e] text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-colors text-lg"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </motion.button>
            </form>

            {submitSuccess === true && (
              <p className="text-green-500 mt-4 text-center">{message}</p>
            )}
            {submitSuccess === false && (
              <p className="text-red-500 mt-4 text-center">{message}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;
