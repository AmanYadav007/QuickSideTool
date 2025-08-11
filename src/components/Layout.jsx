import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
// Removed framer-motion dependency for layout

const Layout = ({ children, showAnimatedBackground = true }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#071a1c] via-[#0b2530] to-[#0e1b26] text-white relative overflow-x-hidden">
      {/* Simple CSS progress bar alternative could be added later if needed */}
      {showAnimatedBackground && <AnimatedBackground />}
      <Navbar />
      <main className="relative z-10 pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;


