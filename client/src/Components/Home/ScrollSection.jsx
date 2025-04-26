import { useEffect, useRef } from "react";
import siba from "../../assets/siba.mp4";
export default function ScrollSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className=" relative bg-[#16215c]">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <img
          src="https://liamcrest.com/assets/static/header/Asset%2073.png"
          alt="Background Pattern"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Content */}
      <div className=" flex items-center py-4 lg:py-0">
        <div className="max-w-[2000px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-24 items-center relative z-20">
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 order-2 lg:order-1">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={siba} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-white space-y-3 lg:space-y-8 order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-[65px] font-bold leading-tight">
              Smart NCEAC Accreditation System <br />{" "}
              <span className="text-3xl sm:text-4xl lg:text-[45px]">
                Ensurity of excellence in accreditation.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-200 leading-relaxed">
              Your vision, our innovation: a seamless journey to accreditation
              excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
