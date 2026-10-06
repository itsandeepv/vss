import { business } from "@/content/site";
import { Icon } from "@/components/Icon";
import { HeroVideo } from "@/components/HeroVideo";
import {
  AboutSplit,
  BrochureCta,
  Clients,
  ContactBlock,
  GalleryTeaser,
  Industries,
  Process,
  Psara,
  ServicesGrid,
  StatsStrip,
  WhyUs,
} from "@/components/sections";

const [primaryPhone] = business.phones;

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroVideo />
      <div className="container">
        <div className="hero-content">
          <p className="eyebrow eyebrow-light hero-anim">{business.tagline}</p>
          <h1 id="hero-title" className="hero-anim">
            {business.name}
          </h1>
          <p className="hero-sub hero-anim">PSARA Licensed Security &amp; Manpower Services in Gurugram, Haryana</p>
          <p className="hero-text hero-anim">{business.strapline}</p>
          <div className="hero-actions hero-anim">
            <a href="#contact" className="btn btn-gold">
              Request Free Consultation
              <Icon name="arrow-right" size={18} />
            </a>
            <a href={`tel:${primaryPhone.tel}`} className="btn btn-outline-light">
              <Icon name="phone" size={18} />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <AboutSplit />
      <WhyUs />
      <ServicesGrid />
      <Industries />
      <Process />
      <Psara />
      <BrochureCta />
      <GalleryTeaser />
      <Clients />
      <ContactBlock />
    </>
  );
}
