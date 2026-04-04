import FeatureSection from "../components/home/FeatureSection";
import Footer from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import HowItWorks from "../components/home/HowitWorks";
import UseCases from "../components/home/UseCases";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CTABanner from "../components/home/CTABanner";
import SectionConnector from "../components/SectionConnector";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <SectionConnector />
      <FeatureSection />
      <UseCases />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </>
  );
};

export default HomePage;