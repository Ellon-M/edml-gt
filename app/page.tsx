import LandingHero from "@/components/LandingHero";
import FeaturedProperties from "@/components/FeaturedProperties";
import ListYourProperty from "@/components/ListYourProperty";
import WhyChooseUs from "@/components/WhyChooseUs";
import Pricing from "@/components/Pricing";
import BlogPreview from "@/components/BlogPreview";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LandingHero />
    <FeaturedProperties />
      <ListYourProperty />
      <WhyChooseUs />
      <Pricing />
      <BlogPreview />
      <Footer />
    </div>
  );
}