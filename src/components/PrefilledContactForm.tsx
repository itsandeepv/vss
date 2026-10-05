"use client";

import { useSearchParams } from "next/navigation";
import { services } from "@/content/site";
import { ContactForm } from "./ContactForm";

/** Contact form with the service preselected from `?service=<id>` (links from service pages). */
export function PrefilledContactForm() {
  const id = useSearchParams().get("service");
  const service = services.find((s) => s.id === id)?.title ?? "";
  return <ContactForm key={service} defaultService={service} />;
}
