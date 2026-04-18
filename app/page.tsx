import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import CharityImpact from '@/components/home/CharityImpact';
import Testimonials from '@/components/home/Testimonials';
import FeaturedCharities from '@/components/home/FeaturedCharities';
import FAQ from '@/components/home/FAQ';
import Pricing from '@/components/home/Pricing';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#040911' }}>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <CharityImpact />
        <FeaturedCharities />
        <Testimonials />
        <FAQ />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
