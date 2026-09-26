import React from 'react';
import SEO from '../components/SEO';
import PDFManipulator from '../components/PDFManipulator';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';

const PDFTool = () => {
  return (
    <Layout>
      <SEO
        title="Free Online PDF Tools – Compress, Unlock, Convert"
        description="All your essential PDF utilities in one place. Fast, secure, no sign‑up."
      />
      <div className="container pt-6 pb-12 md:pb-16">
        <BackButton />
        <div className="mt-6">
          <PDFManipulator />
        </div>
      </div>
    </Layout>
  );
};

export default PDFTool;