import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo2.jpg";
import { Menu, X } from "lucide-react";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out py-4 sm:py-6 lg:py-8 ${
        scrolled || isMenuOpen
          ? "bg-white shadow-lg "
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center relative">
        <Link to="/" className="flex items-center z-20">
          <img src={logo} alt="Liam Crest" className="h-8 sm:h-10 lg:h-12" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden z-20 text-[#1F2C73] hover:text-[#4B6FA6] transition-colors"
        >
          {isMenuOpen ? (
            <X
              size={24}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            />
          ) : (
            <Menu size={24} />
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 xl:space-x-16">
          {["Home", "About", "Login"].map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase().replace(" ", "-")}`}
              className={`transition-colors duration-300 font-medium ${
                scrolled ? "text-[#1F2C73]" : "text-[#1F2C73]"
              } hover:text-[#4B6FA6]`}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/contact"
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 ${
              scrolled
                ? "bg-[#1F2C73] text-white hover:bg-[#2B4C7E]"
                : "bg-[#B8D1E7] text-[#1F2C73] hover:bg-[#A3C3E2]"
            }`}
          >
            CONTACT US
          </Link>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div
            className="flex flex-col bg-white items-center justify-center min-h-screen space-y-6"
            style={{
              backgroundImage:
                "url(https://liamcrest.com/assets/static/header/Asset%2072.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {["Home", "About", "Login"].map((label) => (
              <Link
                key={label}
                to={`/${label.toLowerCase().replace(" ", "-")}`}
                className="text-[#1F2C73] text-xl font-medium hover:text-[#4B6FA6] transition-colors border-b-[1px]  border-[#1F2C73] py-1 "
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <Link
              to="/contact"
              className="bg-[#1F2C73] text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-[#2B4C7E] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
