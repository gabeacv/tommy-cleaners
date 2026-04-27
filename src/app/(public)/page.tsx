import About from "@/components/sections/About";
import EnquiryForm from "@/components/sections/EnquiryForm";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full select-none selection:bg-primary/30 selection:text-charcoal cursor-default overflow-x-hidden">
      <main className="flex flex-1 flex-col w-full scroll-smooth">
        <Hero />
        <About />
        <HowItWorks />
        <Gallery />
        <FAQ />
        <EnquiryForm />
        <Footer />
      </main>
    </div>
  );
}

