import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Footer1 from './footer';
import AuthModal from './header';

function Home() {
  const [textColor, setTextColor] = useState("text-white");

  useEffect(() => {
    const colors = ["text-white", "text-yellow-400", "text-blue-400", "text-pink-400"];
    let index = 0;
    const interval = setInterval(() => {
      setTextColor(colors[index]);
      index = (index + 1) % colors.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* <AuthModal/> */}
      <div 
        className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: "url('img/6.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', height: '100vh' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* שכבת כהות */}

        <div className="relative text-center px-6 md:px-12 z-10 flex flex-col items-center justify-center">
          {/* כותרת עם אנימציה */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2 }} 
            className={`text-7xl md:text-8xl font-extrabold mb-6 tracking-tight text-shadow-2xl transition-colors duration-500 ${textColor}`}
          >
            PicStory
          </motion.h1>

          {/* טקסט עם אנימציה */}
          <motion.p 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.5, delay: 0.4 }} 
            className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-300 tracking-wider leading-relaxed"
          >
            נהל את התמונות המשפחתיות שלך בקלות, צור מצגות, קולאז'ים ושתף רגעים יקרים.
          </motion.p>
      
        </div>
      </div>

      {/* Footer */}
      <Footer1 />
    </>
  );
}

export default Home;
