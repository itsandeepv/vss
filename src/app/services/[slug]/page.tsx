import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, business, industries, photos, serviceHref, services, whatsappHref } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero, Process, WhyUs } from "@/components/sections";

// Static export: only the 9 known services are generated; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

const find = (slug: string) => services.find((s) => s.id === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = find((await params).slug);
  if (!s) return {};
  return pageMeta({
    title: `${s.title} in Gurugram`,
    description: `${s.text} PSARA licensed agency, Farrukhnagar, Gurugram.`,
    path: serviceHref(s.id),
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = find((await params).slug);
  if (!s) notFound();
  const [primary, helpline] = business.phones;
  const others = services.filter((o) => o.id !== s.id);
  const ideal = industries.filter((ind) => s.idealFor.includes(ind.title));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.intro,
    serviceType: s.title,
    url: `${SITE_URL}${serviceHref(s.id)}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: business.areaServed.map((name) => ({ "@type": "Place", name })),
  };

  return (
    <>
      <PageHero
        title={s.title}
        tagline={s.tagline}
        image={s.banner ?? s.image ?? photos.gate}
        crumbs={[
          { href: "/services/", label: "Services" },
          { href: serviceHref(s.id), label: s.title },
        ]}
      />

      {/* TODO: confirm — services marked `confirm` in site.ts are from the website brief, not the brochure. */}
      <section className="section" aria-labelledby="overview-title">
        <div className="container service-layout">
          <div className="service-main">
            <div className="reveal">
              <p className="eyebrow">Overview</p>
              <h2 id="overview-title">{s.title} by VSS</h2>
              <p className="lead">{s.intro}</p>
            </div>

            {s.id === "gunman" && (
              <p className="notice reveal" role="note">
                <Icon name="badge" size={20} />
                Armed guarding is provided subject to applicable arms licensing and regulations.
              </p>
            )}

            <div className="reveal">
              <h3 className="sub-title">What&apos;s included</h3>
              <ul className="include-list">
                {s.includes.map((item) => (
                  <li key={item}>
                    <span className="include-check" aria-hidden="true">
                      <Icon name="check" size={16} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {ideal.length > 0 && (
              <div className="reveal">
                <h3 className="sub-title">Ideal for</h3>
                <ul className="ideal-grid">
                  {ideal.map((ind) => (
                    <li key={ind.title}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP, static export */}
                      <img src={ind.image.src.replace(/\.webp$/, "-800.webp")} alt="" width={800} height={533} loading="lazy" />
                      <span>
                        <Icon name={ind.icon} size={18} />
                        {ind.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="service-aside" aria-label="Get a quote">
            <div className="quote-card reveal reveal-right">
              <span className="icon-badge">
                <Icon name={s.icon} size={26} />
              </span>
              <h2 className="quote-title">Get a quote for {s.title}</h2>
              <p>Free site survey and deployment plan. We usually respond within one working day.</p>
              <Link href={`/contact/?service=${s.id}#enquiry`} className="btn btn-gold btn-block">
                Request a Quote
                <Icon name="arrow-right" size={18} />
              </Link>
              <div className="quote-contacts">
                <a href={`tel:${primary.tel}`}>
                  <Icon name="phone" size={18} />
                  {primary.display}
                </a>
                <a href={`tel:${helpline.tel}`}>
                  <Icon name="clock" size={18} />
                  {helpline.display} <span className="muted">(24×7)</span>
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={18} />
                  WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>

            <nav className="other-services reveal reveal-right" aria-labelledby="other-title">
              <h2 id="other-title" className="quote-title">
                Other services
              </h2>
              <ul>
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={serviceHref(o.id)}>
                      <Icon name={o.icon} size={18} />
                      {o.title}
                      <Icon name="chevron-right" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      <Process />
      <WhyUs />
      <CtaBand title={`Need ${s.title.toLowerCase()} for your site?`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </>
  );
}
