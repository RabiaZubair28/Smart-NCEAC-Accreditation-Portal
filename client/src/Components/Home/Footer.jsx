import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import logo2 from "../../assets/logo2.jpg"
const Footer = () => {
  return (
    <footer className="relative z-20 bg-white py-8 sm:py-12 lg:py-16 font-chap">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 mb-12 lg:mb-16">
          <h2 className="text-primary text-xl sm:text-2xl lg:text-4xl font-bold max-w-2xl text-center lg:text-left">
            IBA-NCEAC Accreditation Portal streamlines the process of evaluating and accrediting computing programs.
          </h2>
          <img 
            src={logo2}
            alt="IBA-SUKKUR Logo"
            className="w-20 sm:w-24 h-auto"
          />
        </div>

        {/* Navigation and Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="space-y-4 text-center sm:text-left">
            <a 
              href="#work" 
              className="block text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              Our Work
            </a>
            <a 
              href="#about" 
              className="block text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="block text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              Contact us
            </a>
          </div>
          
          <div className="text-primary space-y-2 text-center sm:text-left">
            <p className="font-medium">Main Campus</p>
            <p>Sukkur IBA University</p>
            <p className="hover:opacity-80 transition-opacity cursor-pointer">+923337109448</p>
            <p className="hover:opacity-80 transition-opacity cursor-pointer">nceacaccreditation@gmail.com</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 space-y-6 sm:space-y-0">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <a href="#" className="text-primary hover:opacity-80 transition-opacity transform hover:scale-110">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity transform hover:scale-110">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity transform hover:scale-110">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity transform hover:scale-110">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity transform hover:scale-110">
              <Youtube size={20} />
            </a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity transform hover:scale-110 font-medium">
              Be
            </a>
          </div>
          
          <div className="text-center sm:text-right">
            <p className="text-primary text-sm sm:text-[14px]">Copyright (c) 2024, IBA-NCEAC Accreditation Portal - all rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
