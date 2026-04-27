import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

const jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Vize Makinesi — Bağımsız Vize Danışmanlığı",
    description:
        "60'tan fazla yetki alanında seyahat edenlerin, ailelerin ve işletmelerin vize başvurularını hazırlar, sunar ve takip ederiz.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="tr"
            className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
        >
            <body className="min-h-screen flex flex-col bg-cream text-navy">
                <Nav />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
