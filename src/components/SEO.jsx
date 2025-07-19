import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "QuickSideTool - Free PDF Tools, Image Editor, QR Generator | Alternative to Adobe",
  description = "Free online PDF tools, image editor, and QR code generator. Merge, split, unlock PDFs. Resize, compress images. Create QR codes. No registration required. Better than Adobe Acrobat.",
  keywords = "PDF tools, PDF editor, PDF merger, PDF splitter, PDF unlocker, image editor, image compressor, image resizer, QR code generator, free PDF tools, Adobe alternative, online PDF editor, PDF to image, image to PDF, document tools, file converter",
  image = "/og-image.png",
  url = "https://quicksidetool.com",
  type = "website"
}) => {
  const fullTitle = title.includes("QuickSideTool") ? title : `${title} | QuickSideTool`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Aman Yadav" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="QuickSideTool" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a1440" />
      <meta name="msapplication-TileColor" content="#1a1440" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/icon32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icon16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon128.png" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "QuickSideTool",
          "description": "Free online PDF tools, image editor, and QR code generator. Alternative to Adobe Acrobat.",
          "url": "https://quicksidetool.com",
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Aman Yadav",
            "url": "https://aguider.in"
          },
          "featureList": [
            "PDF Merge and Split",
            "PDF Unlocker",
            "PDF Link Remover", 
            "Image Resizer",
            "Image Compressor",
            "QR Code Generator"
          ],
          "screenshot": "https://quicksidetool.com/screenshot.png",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
          }
        })}
      </script>
      
      {/* Additional Keywords for Adobe Competition */}
      <meta name="keywords" content={`
        PDF tools, PDF editor, PDF merger, PDF splitter, PDF unlocker, PDF password remover,
        image editor, image compressor, image resizer, image converter, image to PDF,
        QR code generator, QR code maker, free PDF tools, Adobe alternative, Adobe Acrobat alternative,
        online PDF editor, PDF to image, image to PDF, document tools, file converter,
        PDF processing, PDF manipulation, PDF security, PDF encryption, PDF decryption,
        batch PDF processing, image optimization, image compression, image resizing,
        free online tools, web-based tools, browser tools, no download required,
        PDF merge online, PDF split online, unlock PDF online, compress images online,
        resize images online, create QR codes online, free document tools
      `} />
    </Helmet>
  );
};

export default SEO; 