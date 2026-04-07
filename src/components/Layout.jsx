import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
// Removed framer-motion dependency for layout

const Layout = ({ children, showAnimatedBackground = true }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#08111f] via-[#0b1f2a] to-[#102f2e] text-white relative overflow-x-hidden">
      {/* Simple CSS progress bar alternative could be added later if needed */}
      {showAnimatedBackground && <AnimatedBackground />}
      <Navbar />
      <main className="relative z-10 pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

