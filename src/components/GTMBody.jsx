import React from 'react';

const GTMBody = () => {
  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-TBVQNN72"
          height="0" 
          width="0" 
          style={{display: 'none', visibility: 'hidden'}}
          title="Google Tag Manager"
        />
      </noscript>
      {/* End Google Tag Manager (noscript) */}
    </>
  );
};

export default GTMBody; 