import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavigationLoader from "@/components/global/NavigationLoader";
import { SITE } from "@/data/site";

const SITE_URL = "https://vizemakinesi.com";

const syne = Syne({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

const jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1a5c5b",
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Vize Makinesi — Bağımsız Vize Danışmanlığı",
        template: "%s | Vize Makinesi",
    },
    description:
        "60'tan fazla yetki alanında seyahat edenlerin, ailelerin ve işletmelerin vize başvurularını hazırlar, sunar ve takip ederiz.",
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: SITE_URL,
        siteName: "Vize Makinesi",
        title: "Vize Makinesi — Bağımsız Vize Danışmanlığı",
        description:
            "60'tan fazla yetki alanında seyahat edenlerin, ailelerin ve işletmelerin vize başvurularını hazırlar, sunar ve takip ederiz.",
        images: [{ url: "/VizeMakinesiLogo.png", width: 1200, height: 630, alt: "Vize Makinesi" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Vize Makinesi — Bağımsız Vize Danışmanlığı",
        description:
            "60'tan fazla yetki alanında seyahat edenlerin, ailelerin ve işletmelerin vize başvurularını hazırlar, sunar ve takip ederiz.",
        images: ["/VizeMakinesiLogo.png"],
    },
};

const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Vize Makinesi",
    image: `${SITE_URL}/VizeMakinesiLogo.png`,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
        "@type": "PostalAddress",
        streetAddress: `${SITE.address.street}, ${SITE.address.suite}`,
        addressLocality: SITE.address.city,
        addressCountry: "TR",
    },
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
        },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="tr"
            className={`${syne.variable} ${inter.variable} ${jetbrains.variable}`}
        >
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
                />
                <NavigationLoader />
                {children}
            </body>
        </html>
    );
}
