import { Suspense } from "react";
import { photos } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { ContactForm } from "@/components/ContactForm";
import { PrefilledContactForm } from "@/components/PrefilledContactForm";
import { ContactBlock, PageHero } from "@/components/sections";

export const metadata = pageMeta({
  title: "Contact Us – Free Security Quote in Gurugram, Haryana",
  description:
    "Call or WhatsApp +91 86073 23237, or send an enquiry to Vanshika Security Service, Farrukhnagar, Gurugram, Haryana. Free site survey and quote for security guards and manpower.",
  path: "/contact/",
  keywords: [
    "security agency contact number Gurugram",
    "security guard quote Haryana",
    "hire security guards Gurugram",
    "security agency Farrukhnagar",
  ],
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        tagline="Tell us about your site and we'll call you back with a plan and a quote."
        image={photos.gate}
        crumbs={[{ href: "/contact/", label: "Contact" }]}
      />
      {/* The service picked on a service page arrives as ?service=<id>. Reading it needs the
          browser, so the plain form is prerendered and swapped for the prefilled one on load. */}
      <ContactBlock
        heading={false}
        form={
          <Suspense fallback={<ContactForm />}>
            <PrefilledContactForm />
          </Suspense>
        }
      />
    </>
  );
}
