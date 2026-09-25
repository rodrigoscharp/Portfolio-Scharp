import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">{children}</main>
      <div className="pt-24 md:pt-32">
        <Footer />
      </div>
    </>
  );
}
