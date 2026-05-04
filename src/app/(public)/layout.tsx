import NavServer from "@/components/global/Nav/NavServer";
import Footer from "@/components/global/Footer/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-cream text-navy">
            <NavServer />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
