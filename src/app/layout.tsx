import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavigationLoader from "@/components/global/NavigationLoader";

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
            className={`${syne.variable} ${inter.variable} ${jetbrains.variable}`}
        >
            <body>
                <NavigationLoader />
                {children}
            </body>
        </html>
    );
}
