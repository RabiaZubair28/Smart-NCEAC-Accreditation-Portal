import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import logo from "../../assets/logo2.jpg";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for redirecting after logout

  const goBack = () => window.history.back();
  const goForward = () => window.history.forward();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Handle logout when the user clicks the browser back arrow
    const handleBeforeUnload = () => {
      handleLogout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem("token");

      // Call logout API to clear cookie (if applicable)
      await axios.post(
        "http://localhost:1234/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Force reload to clear cache
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out");
    }
  };

  const handleBackToHome = () => {
    // Redirect to the home page
    navigate("/");
  };

  return (
    <nav
      className={`absolute w-full top-0 z-50 transition-all duration-300 ease-in-out PY-0 ${
        scrolled ? "bg-white/70 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-5 md:px-5 flex justify-between items-center py-3">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Liam Crest" className="h-12" />
        </Link>

        <div className="flex md:space-x-3 space-x-2">
          {/* <button
            className={`md:px-8 px-4 md:py-3 rounded-lg md:font-medium text-sm flex items-center space-x-2 transition-all duration-300 ${
              scrolled
                ? "bg-[#1F2C73] text-white hover:bg-[#2B4C7E]"
                : "bg-[#1F2C73] text-white hover:bg-[#2B4C7E]"
            }`}
            onClick={handleBackToHome} // Redirect to home page
          >
            Back to Home
          </button> */}
          <div className="flex justify-center gap-4 px-4">
            <button
              onClick={goBack}
              className="p-2 rounded-full transition bg-[#1F2C73] text-white hover:bg-[#2B4C7E]"
              title="Go Back"
            >
              <ArrowLeft size={28} />
            </button>
            <button
              onClick={goForward}
              className="p-2 rounded-full bg-[#1F2C73] text-white hover:bg-[#2B4C7E] transition"
              title="Go Forward"
            >
              <ArrowRight size={28} />
            </button>
          </div>
          <div>
            <button
              className={`md:px-8 px-4 rounded-lg md:font-medium font-medium text-center flex items-center justify-center h-[50px] w-[100px] transition-all duration-300 ${
                scrolled
                  ? "bg-[#1F2C73] text-white hover:bg-[#2B4C7E]"
                  : "bg-[#1F2C73] text-white hover:bg-[#2B4C7E]"
              }`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
