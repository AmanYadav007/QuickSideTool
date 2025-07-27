import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const GoogleAds = () => {
  useEffect(() => {
    // Initialize dataLayer for GTM
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'page_view',
        'page_title': document.title,
        'page_location': window.location.href,
      });
    }
  }, []);

  return (
    <Helmet>
      {/* Google Tag Manager */}
      <script>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TBVQNN72');
        `}
      </script>
      {/* End Google Tag Manager */}
    </Helmet>
  );
};

export default GoogleAds; 