import React from 'react';
import SEO from '../components/SEO';
import PDFManipulator from '../components/PDFManipulator';
import Layout from '../components/Layout';

const PDFTool = () => {
  return (
    <Layout>
      <SEO
        title="Free Online PDF Tools – Compress, Unlock, Convert"
        description="All your essential PDF utilities in one place. Fast, secure, no sign‑up."
      />
      <div className="container py-12 md:py-16">
        <PDFManipulator />
      </div>
    </Layout>
  );
};

export default PDFTool;