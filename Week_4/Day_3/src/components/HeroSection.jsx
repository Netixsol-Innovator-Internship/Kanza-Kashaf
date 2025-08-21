import React, { useState, useEffect, useRef } from "react";

const HeroSection = () => {
  const data = [
    {
      image: "/t-war.jpg",
      thumb: "/war.jpg",
      title: "God Of War 4",
      description:
        "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive.",
    },
    {
      image: "/farc.jpg",
      thumb: "/farc.jpg",
      title: "Farcry 6 Golden Edition",
      description:
        "Welcome to Yara, a tropical paradise frozen in time. As dictator of Yara, Anton Castillo is intent on restoring his nation to its former glory by any means necessary.",
    },
    {
      image: "/gta.jpg",
      thumb: "/gta.jpg",
      title: "GTA V",
      description:
        "Enter the lives of three very different criminals and explore the sprawling city of Los Santos in the ultimate open-world experience.",
    },
    {
      image: "/outlast.png",
      thumb: "/outlast.png",
      title: "Outlast 2",
      description:
        "You are Blake Langermann, a cameraman working with your wife, Lynn. You’re both investigative journalists willing to take risks and dig deep to uncover the stories no one else will dare touch.",
    },
  ];

  const [selected, setSelected] = useState(data[0]);
  const [fade, setFade] = useState(true);
  const rightRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(400);

  const handleSelect = (item) => {
    setFade(false);
    setTimeout(() => {
      setSelected(item);
      setFade(true);
    }, 200);
  };

  // Dynamically match left image height to right sidebar
  useEffect(() => {
    const updateHeight = () => {
      if (rightRef.current) {
        const height = rightRef.current.offsetHeight;
        setLeftHeight(height < 400 ? 400 : height);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [selected]);

  return (
    <section className="flex flex-col lg:flex-row gap-6 p-4 bg-black text-white">
      <div
        style={{
          backgroundImage: `url(${selected.image})`,
          height: `${leftHeight}px`,
        }}
        className={`flex items-end bg-cover bg-center w-full lg:w-[850px] rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
          fade ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="z-10 ml-6 p-6 max-w-[90%] sm:max-w-[70%] lg:max-w-[50%] rounded-lg">
          <p className="text-xs tracking-widest text-white uppercase">
            Pre-purchase available
          </p>
          <p className="text-base my-4 leading-relaxed font-light">
            {selected.description}
          </p>
          <button className="mt-4 bg-white text-black px-5 py-3 rounded-md shadow hover:bg-gray-200 transition">
            PRE-PURCHASE NOW
          </button>
        </div>
      </div>

      <div
        ref={rightRef}
        className="flex flex-col gap-6 w-full lg:w-[25%]"
      >
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSelect(item)}
            className={`flex items-center gap-4 p-2 cursor-pointer transition-transform hover:scale-105 ${
              selected.title === item.title
                ? "bg-[#252525] rounded-2xl opacity-100"
                : "opacity-70"
            }`}
          >
            <img
              src={item.thumb}
              alt={item.title}
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
            />
            <p className="text-sm md:text-base lg:text-lg">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
