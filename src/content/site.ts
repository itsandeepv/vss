/**
 * Single source of business data for the website.
 * Every value here is taken from content.md (compiled from the VSS brochure).
 *
 * Values set to `null` are NOT known yet — the UI shows a "to be confirmed"
 * placeholder for them. Search the codebase for "TODO: confirm" to find them all.
 * Never replace a null with a guess.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://vanshikasecurity.com").replace(/\/$/, "");

export const business = {
  name: "Vanshika Security Service",
  shortName: "VSS",
  legalName: "Vanshika Security Service (VSS)",
  tagline: "Think Security First",
  strapline: "Securing your assets and assisting in facility management with the latest technology and processes.",
  foundedYear: 2016,
  phones: [
    { label: "Sales", display: "+91 86073 23237", tel: "+918607323237" },
    { label: "24×7 Helpline", display: "+91 74042 64232", tel: "+917404264232" },
  ],
  /** TODO: confirm — brochure lists 8607323237 for "WhatsApp or Call" (sales team). */
  whatsapp: "918607323237",
  whatsappMessage: "Hi, I need security services for my site.",
  email: "vssagency05@gmail.com",
  address: {
    street: "Ward No. 2, Near Govt. Senior Sec. School, Joniawas",
    locality: "Farrukhnagar",
    district: "Gurugram",
    region: "Haryana",
    postalCode: "122504",
    country: "IN",
    full: "Ward No. 2, Farrukhnagar, Near Govt. Senior Sec. School, Joniawas, Teh. Farrukhnagar, Gurugram (HR) 122504",
  },
  /** TODO: confirm — replace with the exact Google Maps pin embed URL once the client shares it. */
  mapEmbedUrl: "https://maps.google.com/maps?q=Joniawas%2C%20Farrukhnagar%2C%20Gurugram%2C%20Haryana%20122504&z=14&output=embed",
  mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Joniawas%2C+Farrukhnagar%2C+Gurugram%2C+Haryana+122504",
  areaServed: ["Gurugram", "Farrukhnagar", "Pataudi", "Haryana", "Delhi NCR"],
  /**
   * Haryana / NCR cities named in SEO metadata and schema (not shown in the UI).
   * TODO: confirm — trim to the cities VSS actually deploys to.
   */
  seoCities: ["Gurugram", "Manesar", "Farrukhnagar", "Pataudi", "Sohna", "Rewari", "Jhajjar", "Bahadurgarh", "Faridabad", "Sonipat", "Rohtak", "Panipat", "Delhi NCR"],
  /** TODO: confirm — no social profiles in the brochure. Add URLs here (used in footer + schema). */
  social: [] as { label: string; url: string }[],
};

export const psara = {
  /** TODO: confirm — licence number not in the brochure. */
  licenceNo: null as string | null,
  /** TODO: confirm — validity not in the brochure. */
  validity: null as string | null,
  /** Brochure wording: "Valid PSARA licence to run a security agency in Delhi NCR & North India". */
  coverage: "Delhi NCR & North India",
  /** TODO: confirm — states actually named on the licence(s). */
  licensedStates: null as string | null,
  operatingStates: ["Delhi", "Haryana", "Rajasthan", "Uttar Pradesh"],
};

/** "VSS Overview" slide. `value` is the number to count up to. */
export const stats = [
  { value: 1500, suffix: "+", label: "Trained Manpower", note: "across North India" },
  { value: 40, suffix: "+", label: "Clients", note: "served" },
  { value: 120, suffix: "+", label: "Working Sites", note: "in North India" },
  { value: null, suffix: "+", label: "Years of Service", note: "since 2016", sinceYear: 2016 },
] as const;

export const md = {
  name: "Capt. Laxmi Narain",
  role: "Managing Director",
  summary:
    "32 years of service in the Indian Army. Capt. Laxmi Narain leads VSS with strict rules and clear operating guidelines that every guard and supervisor on our sites follows.",
  /** TODO: confirm — add photo at _source/team/laxmi-narain.jpg, run `npm run images`, then set "/images/team/laxmi-narain.webp". */
  photo: null as string | null,
};

export const about = {
  intro:
    "Vanshika Security Service (VSS) is a growing security and facility management group, formed in 2016 by a team with 10 to 12 years of experience in the industry. We serve a wide range of customers across industries and customer segments.",
  body: "Our protective services are developed together with our customers and designed to use technology wherever it helps. Manned guarding remains the cornerstone of VSS, and we keep developing what we offer so we can meet each customer's specific needs at a competitive price.",
  points: [
    "Approx. 50% of our 1500+ workforce in security; the rest in housekeeping, facility management, helpers and technical staff",
    "Ground-level experience with technology-based reporting",
    "Learning shared across markets for the benefit of every customer",
  ],
};

export type IconName =
  | "shield"
  | "badge"
  | "clock"
  | "users"
  | "bolt"
  | "report"
  | "rupee"
  | "phone"
  | "star"
  | "warehouse"
  | "factory"
  | "building"
  | "home"
  | "school"
  | "hospital"
  | "cart"
  | "hotel"
  | "event"
  | "guard"
  | "supervisor"
  | "bouncer"
  | "pso"
  | "gun"
  | "manpower"
  | "broom"
  | "wrench";

export const whyUs: { icon: IconName; title: string; text: string }[] = [
  { icon: "badge", title: "PSARA Licensed", text: "Valid PSARA licence to run a security agency in Delhi NCR & North India." },
  {
    icon: "shield",
    title: "Police-Verified Staff",
    text: "Police verification and personal background checks through our back-office operations team.",
  },
  { icon: "clock", title: "24×7 QRT", text: "A round-the-clock Quick Response Team to handle any kind of emergency on site." },
  { icon: "supervisor", title: "Trained Supervisors", text: "Training, briefing, night checks and surprise visits to monitor every site." },
  {
    icon: "bolt",
    title: "Quick Deployment",
    text: "A young, energetic operations team that mobilises manpower and meets targets on time.",
  },
  {
    icon: "report",
    title: "Daily & Weekly Reporting",
    text: "Daily check-point reports from site, weekly reports to you, with live updates over WhatsApp and our app.",
  },
  {
    icon: "rupee",
    title: "Competitive Pricing",
    text: "Latest minimum wages and full compliance (PF, ESI, bonus, leave, uniform), at a competitive price.",
  },
  {
    icon: "star",
    title: "Army-Led Discipline",
    text: "Led by Capt. Laxmi Narain, 32 years in the Indian Army, with strict operating guidelines.",
  },
];

/**
 * Real VSS photos (originals in _source/photos, optimised by `npm run images`).
 * Each has a full-size `<name>.webp` (hero) and `<name>-800.webp` (cards / mobile).
 */
export type Photo = { src: string; alt: string; /** CSS object-position focal point */ position?: string };

const photo = (name: string, alt: string, position?: string): Photo => ({ src: `/images/photos/${name}.webp`, alt, position });

export const photos = {
  nightLineup: photo("guards-night-lineup", "VSS security guards in black uniforms lined up at a site at night", "50% 45%"),
  blackFive: photo("guards-black-uniform-five", "Five VSS security personnel in black uniforms", "50% 35%"),
  warehouseLineup: photo("guards-warehouse-lineup", "VSS guards in blue uniforms during a briefing inside a warehouse", "50% 40%"),
  indoorFour: photo("guards-indoor-four", "Four VSS security guards in uniform at a client site", "45% 30%"),
  gate: photo("guards-blue-uniform-gate", "VSS security guards in blue uniforms at a site entrance", "50% 30%"),
  jackets: photo("staff-three-jackets", "VSS security staff in winter uniforms at a warehouse", "50% 30%"),
  independenceDay: photo(
    "team-independence-day",
    "VSS guards and housekeeping staff at a site celebration with the Indian flag",
    "50% 55%",
  ),
  warehouseTeam: photo("team-warehouse-housekeeping", "VSS security and housekeeping staff at a warehouse", "50% 50%"),
};

/**
 * Free-licence images (Wikimedia Commons: public domain / CC0 / CC BY) used where no real VSS
 * photo exists yet. Alt text describes the scene only — never presented as VSS staff or sites.
 * CC BY images are credited on /credits/. Replace with real photos whenever available.
 */
export type Credit = { title: string; author: string; license: string; licenseUrl: string; source: string };

const stockPhoto = (name: string, alt: string, position?: string): Photo => ({ src: `/images/stock/${name}.webp`, alt, position });

export const stock = {
  dgSet: stockPhoto("dg-set", "Diesel generator set installed outside a building"),
  cashVan: stockPhoto("cash-van", "Armoured cash-in-transit van"),
  warehouse: stockPhoto("warehouse", "Warehouse aisle with tall storage racks"),
  manufacturing: stockPhoto("manufacturing", "Car assembly line in a manufacturing plant"),
  office: stockPhoto("office", "Modern glass corporate office building"),
  residential: stockPhoto("residential", "High-rise residential apartment towers"),
  school: stockPhoto("school", "College campus building with a lawn"),
  hospital: stockPhoto("hospital", "Clean hospital corridor"),
  retail: stockPhoto("retail", "Supermarket aisle with stocked shelves"),
  hotel: stockPhoto("hotel", "Hotel lobby with chandeliers"),
  event: stockPhoto("event", "Crowd at an evening concert event"),
  cctv: stockPhoto("cctv", "CCTV cameras mounted on a building"),
};

export const imageCredits: Record<string, Credit> = {
  "dg-set": {
    title: "Kirloskar - Silent Diesel Generator Set - Kolkata 2017-12-12 6083.JPG",
    author: "Biswarup Ganguly",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Kirloskar_-_Silent_Diesel_Generator_Set_-_Kolkata_2017-12-12_6083.JPG",
  },
  "cash-van": {
    title: "Brinks armoured van in Tel Aviv.JPG",
    author: "User:Mattes",
    license: "Public domain",
    licenseUrl: "",
    source: "https://commons.wikimedia.org/wiki/File:Brinks_armoured_van_in_Tel_Aviv.JPG",
  },
  warehouse: {
    title:
      "Emergency Planning and Security ^ Technological - Caguas, Puerto Rico, May 29, 2012 -- FEMA's Logistics Management Division open the agency's new, strategically-located Caribbean Di - DPLA - 2587281d6d4d9ff5388ca88f17688f95.jpg",
    author: "Department of Homeland Security. Federal Emergency Management Agency. Public Affairs Division. 3/1/2003",
    license: "Public domain",
    licenseUrl: "",
    source:
      "https://commons.wikimedia.org/wiki/File:Emergency_Planning_and_Security_%5E_Technological_-_Caguas,_Puerto_Rico,_May_29,_2012_--_FEMA%27s_Logistics_Management_Division_open_the_agency%27s_new,_strategically-located_Caribbean_Di_-_DPLA_-_2587281d6d4d9ff5388ca88f17688f95.jpg",
  },
  manufacturing: {
    title: "001 Car factory assembly line - Opel factory in Gliwice, Poland.jpg",
    author: "Marek Ślusarczyk (Tupungato) Photo portfolio",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:001_Car_factory_assembly_line_-_Opel_factory_in_Gliwice,_Poland.jpg",
  },
  office: {
    title: "InterGlobe Technologies Gurgaon Office.jpg",
    author: "Mrktgigt",
    license: "Public domain",
    licenseUrl: "",
    source: "https://commons.wikimedia.org/wiki/File:InterGlobe_Technologies_Gurgaon_Office.jpg",
  },
  residential: {
    title: "Residential Building, Hyderabad, 20022015.jpg",
    author: "Nikhilb239",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Residential_Building,_Hyderabad,_20022015.jpg",
  },
  school: {
    title: "The Doon School Main Building.jpg",
    author: "Adityaoberai",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    source: "https://commons.wikimedia.org/wiki/File:The_Doon_School_Main_Building.jpg",
  },
  hospital: {
    title: "Corridor on the second level - NÄL hospital 1.jpg",
    author: "W.carter",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Corridor_on_the_second_level_-_N%C3%84L_hospital_1.jpg",
  },
  retail: {
    title: "Rimi supermarket at Kaunas Mega mall, 2025 aisle.jpg",
    author: "Bdx",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Rimi_supermarket_at_Kaunas_Mega_mall,_2025_aisle.jpg",
  },
  hotel: {
    title: "The Crowne Plaza Lobby - WikiConference India 2026 - Kochi 2026-09-03 02514.jpg",
    author: "Gangulybiswarup",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    source: "https://commons.wikimedia.org/wiki/File:The_Crowne_Plaza_Lobby_-_WikiConference_India_2026_-_Kochi_2026-09-03_02514.jpg",
  },
  event: {
    title: "Crowd at Tokio Hotel concert at Christopher Street Day Berlin 2023-07-22 21.jpg",
    author: "Leonhard Lenz",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Crowd_at_Tokio_Hotel_concert_at_Christopher_Street_Day_Berlin_2023-07-22_21.jpg",
  },
  cctv: {
    title: "Closed-circuit television (CCTV) cameras.jpg",
    author: "Fourhazzy",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Closed-circuit_television_(CCTV)_cameras.jpg",
  },
};

export type Service = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  /** Real photo, or null to show an illustrated icon panel. TODO: confirm — photos still needed for PSO, Gunman, Electro-Mechanical. */
  image: Photo | null;
  /** Services requested in the website brief but not listed in the brochure — confirm the client offers them. */
  confirm?: boolean;
  /** Detail page content (/services/<id>/). */
  intro: string;
  includes: string[];
  idealFor: string[];
  /** Short line under the page title. */
  tagline: string;
  /** Stock image used as the detail-page banner when there's no real photo. */
  banner?: Photo;
};

export const services: Service[] = [
  {
    id: "security-guards",
    icon: "guard",
    title: "Security Guards",
    text: "Trained, police-verified guards for factories, warehouses, offices, societies and retail, with briefings and night checks.",
    image: photos.gate,
    tagline: "Trained, police-verified guards for every kind of site",
    intro:
      "Manned guarding is the cornerstone of VSS. Every guard is police-verified and background-checked by our operations team, briefed on your site's SOPs, and supervised with night checks and surprise visits. You get daily check-point reports and weekly summaries, with live updates over WhatsApp and our app.",
    includes: [
      "Access control at gates and entry points",
      "Visitor and vehicle entry with our gate security app",
      "Material inward / outward checks",
      "Patrolling and night rounds",
      "Fire control room and first-response support",
      "Daily check-point reports from site",
    ],
    idealFor: ["Warehouses & Logistics", "Manufacturing", "Corporate Offices", "Residential Societies", "Retail & Malls"],
  },
  {
    id: "security-supervisors",
    icon: "supervisor",
    title: "Security Supervisors",
    text: "On-site supervisors who run duty rosters, check posts and send daily reports so standards don't slip.",
    image: photos.jackets,
    confirm: true,
    tagline: "On-site leadership that keeps standards high",
    intro:
      "Supervisors are the link between your site and our operations team. They run duty rosters, brief and check every post, handle escalations and make sure reports reach you on time, backed by our 24×7 Quick Response Team.",
    includes: [
      "Duty roster and shift management",
      "Post checks, night checks and surprise visits",
      "On-the-job training and briefing of guards",
      "Incident handling and escalation",
      "Daily and weekly reporting to the client",
    ],
    idealFor: ["Manufacturing", "Warehouses & Logistics", "Corporate Offices", "Residential Societies"],
  },
  {
    id: "bouncers",
    icon: "bouncer",
    title: "Bouncers",
    text: "Well-built, disciplined bouncers for crowd control at clubs, restaurants, events and venues.",
    image: photos.blackFive,
    confirm: true,
    tagline: "Disciplined crowd control for venues and events",
    intro:
      "Well-built, disciplined bouncers who manage entry and crowds calmly and keep guests and staff safe, for regular venue duty or one-off events.",
    includes: [
      "Entry management and guest screening",
      "Crowd control and queue management",
      "Conflict de-escalation",
      "VIP area and backstage access control",
      "Coordination with venue management",
    ],
    idealFor: ["Hotels & Restaurants", "Events", "Retail & Malls"],
  },
  {
    id: "pso",
    icon: "pso",
    title: "Personal Security Officer (PSO)",
    text: "Discreet personal protection for executives, VIPs and families, at work, at home and on the move.",
    image: null,
    confirm: true,
    tagline: "Discreet personal protection, wherever you go",
    intro:
      "Personal Security Officers provide close protection for executives, VIPs and families: at the office, at home and while travelling, with a low profile and constant awareness.",
    includes: [
      "Close protection at work, home and while travelling",
      "Route and venue awareness",
      "Liaison with site security teams",
      "Emergency response and evacuation support",
    ],
    idealFor: ["Corporate Offices", "Events", "Hotels & Restaurants"],
    banner: stock.cctv,
  },
  {
    id: "gunman",
    icon: "gun",
    title: "Gunman",
    text: "Armed guards for cash, high-value assets and sensitive sites, subject to applicable arms licensing and regulations.",
    image: stock.cashVan,
    confirm: true,
    tagline: "Armed protection for cash and high-value assets",
    intro:
      "Armed guards for cash movement, high-value assets and sensitive sites. This service is subject to applicable arms licensing and regulations, and is provided only where permitted.",
    includes: [
      "Armed guarding for high-value sites",
      "Cash and valuables escort",
      "Armed support at sensitive entry points",
      "Coordination with site security and the QRT",
    ],
    idealFor: ["Manufacturing", "Retail & Malls", "Warehouses & Logistics"],
    banner: stock.cashVan,
  },
  {
    id: "event-security",
    icon: "event",
    title: "Event Security",
    text: "Planned security teams for weddings, corporate events, exhibitions and public gatherings, covering access control and crowd management.",
    image: photos.nightLineup,
    confirm: true,
    tagline: "Planned security for every size of event",
    intro:
      "From weddings and corporate events to exhibitions and public gatherings, we plan manpower, entry points and crowd flow in advance, then deploy guards, bouncers and supervisors to match.",
    includes: [
      "Pre-event site survey and deployment plan",
      "Entry, ticket and access control",
      "Crowd and queue management",
      "VIP and stage area security",
      "Parking and traffic marshalling",
    ],
    idealFor: ["Events", "Hotels & Restaurants", "Corporate Offices"],
  },
  {
    id: "manpower",
    icon: "manpower",
    title: "Manpower Services",
    text: "Regular or extra manpower, including helpers, pantry boys and welders, deployed at latest minimum wages with full compliance.",
    image: photos.independenceDay,
    tagline: "Regular or extra manpower, fully compliant",
    intro:
      "Helpers, pantry boys, welders and other manpower for regular or extra requirements, deployed at the latest minimum wages with full statutory compliance (PF, ESI, bonus, leave, uniform and national holidays).",
    includes: [
      "Helpers and loaders",
      "Pantry and office boys",
      "Welders and semi-skilled staff",
      "Short-term and long-term deployment",
      "Full statutory compliance and payroll",
    ],
    idealFor: ["Manufacturing", "Warehouses & Logistics", "Corporate Offices"],
  },
  {
    id: "facility-management",
    icon: "broom",
    title: "Housekeeping & Facility Management",
    text: "Housekeeping, horticulture, garbage handling, pest control and disinfestation, plus gate visitor checks with our security app.",
    image: photos.warehouseTeam,
    tagline: "Clean, green and well-run premises",
    intro:
      "Facility services through a single window: housekeeping, horticulture, garbage handling, pest control and disinfestation, along with gate visitor management using our security app.",
    includes: [
      "Housekeeping staff and supervision",
      "Horticulture and landscape maintenance",
      "Household and site garbage handling",
      "Pest control and disinfestation",
      "Gate visitor management with security app",
    ],
    idealFor: ["Corporate Offices", "Residential Societies", "Hospitals", "Schools & Colleges"],
  },
  {
    id: "electro-mechanical",
    icon: "wrench",
    title: "Electro-Mechanical & Fire Safety",
    text: "DG, lift, HVAC, STP and HT/LT AMC support; trained fire control room staff; regular fire-system checks and mock drills.",
    image: stock.dgSet,
    tagline: "Technical maintenance and fire safety you can count on",
    intro:
      "Maintenance services for your building's critical systems, plus trained staff for fire safety: control rooms, regular checks and mock drills, with daily reports from site.",
    includes: [
      "Diesel generator maintenance",
      "Lift and escalator AMC",
      "Cooling tower and chiller plant",
      "HT/LT services AMC",
      "Motors, pumps, HVAC and STP AMC",
      "Fire control room staff, hydrant and sprinkler checks, mock drills, CCTV controller",
    ],
    idealFor: ["Corporate Offices", "Manufacturing", "Hospitals", "Residential Societies"],
    banner: stock.dgSet,
  },
];

export const industries: { icon: IconName; title: string; image: Photo }[] = [
  { icon: "warehouse", title: "Warehouses & Logistics", image: stock.warehouse },
  { icon: "factory", title: "Manufacturing", image: stock.manufacturing },
  { icon: "building", title: "Corporate Offices", image: stock.office },
  { icon: "home", title: "Residential Societies", image: stock.residential },
  { icon: "school", title: "Schools & Colleges", image: stock.school },
  { icon: "hospital", title: "Hospitals", image: stock.hospital },
  { icon: "cart", title: "Retail & Malls", image: stock.retail },
  { icon: "hotel", title: "Hotels & Restaurants", image: stock.hotel },
  { icon: "event", title: "Events", image: stock.event },
];

/**
 * Management & core team, as listed in the brochure ("Pic will be updated soon").
 * TODO: confirm — photos for each person; the brochure spells the marketing head as both
 * "Azad Yadav" and "Azad Singh" (Singh also on flyers and the contact page).
 */
export const team: { name: string; role: string; note: string; photo?: string }[] = [
  { name: "Capt. Laxmi Narain", role: "Managing Director", note: "32 years in the Indian Army" },
  { name: "Mukesh Yadav", role: "Director, Operations", note: "20 years of experience" },
  { name: "O.P. Yadav", role: "Director, Sales", note: "22 years in sales & operations" },
  { name: "Rakesh Kumar", role: "Head, Operations", note: "26 years in the Indian Army" },
  { name: "Mahender Sharma", role: "Manager Head", note: "24 years in the Indian Army" },
  { name: "Pawan", role: "Head, Finance", note: "Graduate & CA Inter, 20 years in finance" },
  { name: "Azad Singh", role: "Head, Sales & Marketing", note: "Graduate" },
  { name: "Manish Sharma", role: "Head, Sales", note: "Graduate, 6 years of experience" },
  { name: "Punit", role: "Finance Controller", note: "5 years in finance" },
];

export const processSteps = [
  { title: "Site Survey", text: "We visit your site to assess risks, entry points and manpower needs." },
  { title: "Planning", text: "A clear deployment plan with posts, shifts, duties and a quotation." },
  { title: "Deployment & Briefing", text: "Verified, uniformed staff are deployed and briefed on your site's SOPs." },
  { title: "Supervision", text: "Supervisors carry out night checks, surprise visits and training on site." },
  { title: "Monitoring", text: "Our 24×7 QRT and WhatsApp/app tracking keep every post monitored." },
  { title: "Reporting & Improvement", text: "Daily and weekly reports to you, with regular reviews to keep improving." },
];

/**
 * Client names from the brochure's "Our Clientele" page.
 * TODO: confirm — client permission to display names; logos go in _source/clients (see README).
 * Set `logo` to "/images/clients/<file>.webp" once a logo is supplied.
 */
export const clients: { name: string; logo?: string }[] = [
  "Samsung",
  "Metro Cash & Carry",
  "Tata Housing",
  "M3M",
  "Ansal API",
  "Pantaloons",
  "Central",
  "Big Bazaar",
  "Brand Factory",
  "fbb",
  "Foodhall",
  "HomeTown",
  "Myntra",
  "Jabong",
  "Licious",
  "Bikanervala",
  "Citykart",
  "Syska LED",
  "Ezone",
  "Raj Mandir Hypermarket",
  "Accuprint",
  "ProFac",
  "247 Daily Needs",
  "Jagdish Store",
  "Print Partners",
  "24Karat",
  "Oysters",
  "Weeltech Rollers Pvt Ltd",
  "Atlas Electrical Pvt Ltd",
  "Priyanka Industries",
].map((name) => ({ name }));

/**
 * Hero background video — built from the real staff photos by `npm run video`
 * (or from real footage dropped into _source/video/). Poster shows instantly and
 * is all that reduced-motion / data-saver visitors see.
 */
export const heroVideo = {
  poster: "/video/hero-poster.webp",
  sources: [
    { src: "/video/hero-480.mp4", media: "(max-width: 767px)" },
    { src: "/video/hero-720.mp4", media: undefined },
  ],
  alt: "VSS security guards and staff on duty at client sites",
};

/** Short lines that rotate under the hero buttons. */
export const heroCaptions = [
  "Manned guarding: the cornerstone of VSS",
  "Training and briefing at every site",
  "24×7 Quick Response Team for on-site emergencies",
  "Police-verified, trained and supervised staff",
];

/**
 * Gallery. `team` = real photos of VSS staff; `flyers` = the client's own marketing flyers.
 * TODO: confirm — flyers show phone 8814841354 and PIN 122506, which differ from the brochure (see content.md).
 */
export type GalleryItem = {
  id: string;
  kind: "team" | "flyers";
  thumb: string;
  full: string;
  alt: string;
  caption: string;
  w: number;
  h: number;
};

const teamItem = (p: Photo, caption: string, w: number, h: number): GalleryItem => ({
  id: p.src,
  kind: "team",
  thumb: p.src.replace(/\.webp$/, "-800.webp"),
  full: p.src,
  alt: p.alt,
  caption,
  w,
  h,
});
const flyer = (name: string, caption: string, alt: string, w: number, h: number): GalleryItem => ({
  id: name,
  kind: "flyers",
  thumb: `/images/flyers/${name}-800.webp`,
  full: `/images/flyers/${name}.webp`,
  alt,
  caption,
  w,
  h,
});

export const gallery: GalleryItem[] = [
  teamItem(photos.nightLineup, "Night shift line-up", 800, 800),
  teamItem(photos.blackFive, "Security team in black uniform", 800, 691),
  teamItem(photos.warehouseLineup, "Briefing at a warehouse site", 800, 359),
  teamItem(photos.indoorFour, "Guards at a client facility", 800, 450),
  teamItem(photos.gate, "Guards at a site entrance", 800, 543),
  teamItem(photos.jackets, "Winter duty at a warehouse", 800, 1067),
  teamItem(photos.independenceDay, "Independence Day at site", 800, 600),
  teamItem(photos.warehouseTeam, "Security & housekeeping team", 800, 360),
  flyer(
    "flyer-we-protect",
    "We protect what matters most",
    "VSS Security flyer: our services are trained security guards, 24/7 surveillance, commercial security, residential security, event security and custom security solutions. Contact 8607323237, Vssagency05@gmail.com.",
    800,
    800,
  ),
  flyer(
    "flyer-services-overview",
    "Complete security solutions",
    "Vanshika Security Service (VSS) flyer: security services for offices, factories, schools, hospitals, societies and commercial premises, including trained security guards, 24×7 security, bouncer service, gunman service and event, VIP, industrial and personal security. Contact 8607323237, 8814841354.",
    800,
    1200,
  ),
  flyer(
    "flyer-professional-advice",
    "Professional security advice",
    "Vanshika Security Service flyer, 'Your Safety, Our Priority': security tips on staying aware, securing access, using CCTV and alarms, trained security, emergency preparedness and a safe environment. Contact +91 8607323237, vssagency05@gmail.com, Pataudi Road, Farrukhnagar, Gurgaon, Haryana.",
    800,
    1200,
  ),
  flyer(
    "flyer-business-card-banner",
    "Business card",
    "Vanshika Security Service business card: PSARA certified company offering security, manpower, bouncer, PSO and gunman services. Farrukhnagar, Gurugram, Haryana; 8607323237, 8814841354; vssagency05@gmail.com.",
    800,
    485,
  ),
  flyer(
    "flyer-business-card-azad-singh",
    "Business card: Azad Singh",
    "VSS Security business card for Azad Singh, Director: 8607323237, 8814841354, vssagency05@gmail.com, Farrukhnagar, Gurugram, Haryana. Services: corporate and industrial, residential and event security, bouncers, PSO, gunman and manpower supply.",
    800,
    533,
  ),
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/services/", label: "Services" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/contact/", label: "Contact" },
];

export const serviceHref = (id: string) => `/services/${id}/`;

export const whatsappHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(business.whatsappMessage)}`;
