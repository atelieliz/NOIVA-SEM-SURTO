import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Noiva Sem Surto — Descubra o que vem primeiro",
  description:
    "Descubra sua próxima decisão e organize casamento, bodas ou celebração com uma rota personalizada.",
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
  themeColor: "#fff8ee",
};

const pixelCode = `
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
`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800;9..144,900&display=swap"
          rel="stylesheet"
        />
      </head>
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
