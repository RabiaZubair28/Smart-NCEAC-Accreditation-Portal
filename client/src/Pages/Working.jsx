import React from 'react'
import App from "../Components/Working/App.jsx";
import PricingSection from "../Components/Working/PricingSection.jsx"
import Component04 from "../Components/Working/Component04.jsx";
import FloatingCircle from "../Components/Working/FloatingCircle.jsx"
import Carousal from '../Components/Working/Carousal.jsx';
import Footer from '../Components/Home/Footer.jsx';
import Seemore from '../Components/Home/Seemore.jsx';
import StatsSection from '../Components/Working/StatsSection.jsx';
const Working = () => {
  return (
    <>
 
    <App/>
    <PricingSection/>
    <StatsSection />
    <Carousal />
    <Seemore></Seemore>
    <Footer />
    </>
  )
}

export default Working