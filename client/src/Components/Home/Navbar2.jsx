import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/logo2.jpg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChevronRight, ChevronDown } from "lucide-react";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [details, setDetails] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const getDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/data/instructor/${params.insid}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch details");
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const goBack = () => window.history.back();
  const goForward = () => window.history.forward();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".avatar-menu")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post(
        "http://localhost:1234/api/auth/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out");
    }
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

        <div className="flex md:space-x-3 space-x-2 items-center">
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

          {/* Avatar and dropdown */}
          <div className="relative avatar-menu">
            <div
              className="flex items-center gap-2 cursor-pointer shadow-lg px-3 py-1 rounded-lg  border-gray-900"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img
                src={details.avatar}
                alt="Avatar"
                className="h-[50px] w-[50px] rounded-full object-cover"
              />
              <ChevronRight
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  showMenu ? "rotate-90" : ""
                }`}
              />
            </div>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 text-center">
                  <img
                    src={details.avatar}
                    className="h-[150px] w-[150px] rounded-full mx-auto object-cover"
                    alt="Profile"
                  />
                  <h3 className="font-semibold mt-2 text-xl">
                    {details.firstName}&nbsp;
                    {details.lastName}
                  </h3>
                  <p className="text-md text-gray-600">
                    {details.email || "Email not available"}
                  </p>
                </div>
                <ul className="flex flex-col py-2 text-md">
                  <li
                    onClick={() => {
                      navigate(`/instructor/${params.insid}`);
                      setShowMenu(false);
                    }}
                    className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClickCapture={() => {
                      navigate(`/personal-info/${details._id}`);
                    }}
                  >
                    Personal Information
                  </li>
                  <li
                    onClick={() => {
                      navigate(`/instructor/${params.insid}`);
                      setShowMenu(false);
                    }}
                    className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClickCapture={() => {
                      navigate(`/research-info/${details._id}`);
                    }}
                  >
                    Research Information
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-black"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
