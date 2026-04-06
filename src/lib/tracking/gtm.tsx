import Script from "next/script";

import { resolveGtmId } from "@/lib/tracking/public-env";

export function GoogleTagManager() {
  const gtmId = resolveGtmId();

  if (!gtmId) {
    return null;
  }

  const inlineScript = `
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
`;

  return (
    <>
      <Script id="kapten-batik-gtm" strategy="beforeInteractive">
        {inlineScript}
      </Script>
      <noscript>
        <iframe
          height="0"
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
          width="0"
        />
      </noscript>
    </>
  );
}
