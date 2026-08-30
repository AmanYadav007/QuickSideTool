import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-text">
      <Navbar />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
