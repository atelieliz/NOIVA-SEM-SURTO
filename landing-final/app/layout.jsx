import Script from "next/script";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  title: "Noiva Sem Surto — Uma decisão de cada vez",
  description:
    "Faça seu diagnóstico e descubra qual decisão merece atenção primeiro no planejamento da sua celebração.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Noiva Sem Surto",
    description:
      "Você não precisa organizar tudo agora. Precisa descobrir o que vem primeiro.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080708",
};

const pixelCode = `
  (function () {
    if (window.__nssMetaPixelInitialized) return;
    window.__nssMetaPixelInitialized = true;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '3331832193668276');
    fbq('track', 'PageView');

    (window.__nssPendingPixelEvents || []).forEach(function (event) {
      fbq('trackCustom', event[0], event[1]);
    });
    window.__nssPendingPixelEvents = [];
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">
          {pixelCode}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3331832193668276&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
