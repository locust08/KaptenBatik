"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { StandardFooter } from "@/components/standard-footer";
import { pushLeadFormSubmitSuccessTracking } from "@/lib/tracking/analytics";
import { getOrCreateContactTrackingSnapshot } from "@/lib/tracking/capture";
import type { ContactTrackingSnapshot } from "@/types/tracking";
import styles from "./contact-page.module.css";

const allStoreLocationsHref =
  "https://www.google.com/maps/search/kapten+batik/@3.0541885,101.5419354,12z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D";

type BoutiqueLocation = {
  addressLines: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string[];
  id: string;
  label: string;
  note?: string;
  phone: string;
  title: string;
};

const boutiqueLocations: BoutiqueLocation[] = [
  {
    addressLines: [
      "Lot F - 215B, Level 1",
      "The Gardens Mall, Lingkaran Syed Putra",
      "Mid Valley City",
      "59200 Wilayah Persekutuan Kuala Lumpur",
    ],
    coordinates: {
      lat: 3.1169,
      lng: 101.6769,
    },
    hours: ["10AM - 10PM daily"],
    id: "gardens-flagship",
    label: "Flagship Store",
    phone: "+6 03-2738 8272",
    title: "The Gardens Mall",
  },
  {
    addressLines: [
      "Block A, Taman Perindustrian Bandar Kinrara 1",
      "Jalan Kinrara 2, Bandar Kinrara",
      "47180 Puchong, Selangor",
    ],
    coordinates: {
      lat: 3.0217,
      lng: 101.6437,
    },
    hours: ["9AM - 5PM (Mon to Fri)", "12:30PM - 2PM (Rest)"],
    id: "warehouse-hq",
    label: "Warehouse Headquarters",
    note: "Pick-up available, no showroom. WhatsApp: +60103605321 | Office: +60380825984",
    phone: "+60380825984",
    title: "Kapten Batik HQ",
  },
  {
    addressLines: [
      "G3-11 Publika Shopping Gallery",
      "1, Jln Solaris Dutamas",
      "50480 Kuala Lumpur",
    ],
    coordinates: {
      lat: 3.1712,
      lng: 101.6586,
    },
    hours: ["10AM - 10PM daily"],
    id: "publika",
    label: "Lifestyle Store",
    phone: "+6 03-6414 3281",
    title: "Publika",
  },
  {
    addressLines: [
      "F110, First Floor",
      "Bangsar Shopping Centre",
      "285, Jalan Maarof, Bukit Bandaraya",
      "59000 Kuala Lumpur",
    ],
    coordinates: {
      lat: 3.1325,
      lng: 101.6675,
    },
    hours: ["10AM - 10PM daily"],
    id: "bangsar",
    label: "Boutique",
    phone: "+6 03 2011 0510",
    title: "Bangsar Shopping Centre",
  },
  {
    addressLines: [
      "G101, Ground Floor",
      "The Curve",
      "6, Jalan PJU 7/3, Mutiara Damansara",
      "47800 Selangor",
    ],
    coordinates: {
      lat: 3.1575,
      lng: 101.6098,
    },
    hours: ["10AM - 10PM daily"],
    id: "curve",
    label: "Boutique",
    phone: "+6 03 7613 2235",
    title: "The Curve",
  },
  {
    addressLines: [
      "2.27A, Level 2 Gurney Paragon Mall",
      "163-D Persiaran Gurney",
      "10250 Penang",
    ],
    coordinates: {
      lat: 5.4401,
      lng: 100.3087,
    },
    hours: ["10AM - 10PM daily"],
    id: "gurney",
    label: "Penang Boutique",
    phone: "+6 04 2868 293",
    title: "Gurney Paragon Mall Penang",
  },
  {
    addressLines: [
      "G1-19 Ground Floor KL East Mall",
      "823, Jln Lingkaran Tengah 2",
      "53100 Wilayah Persekutuan Kuala Lumpur",
    ],
    coordinates: {
      lat: 3.2127,
      lng: 101.7257,
    },
    hours: ["10AM - 10PM daily"],
    id: "kl-east",
    label: "Mall Boutique",
    phone: "+6 03 4161 4575",
    title: "KL East Mall",
  },
  {
    addressLines: [
      "Level 3 Isetan Suria KLCC Jalan Ampang",
      "50088 Kuala Lumpur",
    ],
    coordinates: {
      lat: 3.1576,
      lng: 101.7127,
    },
    hours: ["10AM - 10PM daily"],
    id: "isetan-klcc",
    label: "Department Store",
    phone: "+6 011 3996 1331",
    title: "Isetan KLCC",
  },
  {
    addressLines: [
      "Level 2 Isetan The Gardens Mall",
      "Lingkaran Syed Putra, Mid Valley City",
      "59200 Kuala Lumpur",
    ],
    coordinates: {
      lat: 3.1171,
      lng: 101.6764,
    },
    hours: ["10AM - 10PM daily"],
    id: "isetan-gardens",
    label: "Department Store",
    phone: "+6 013 268 5471",
    title: "Isetan The Gardens Mall",
  },
  {
    addressLines: [
      "SAT-P-A10 (GATE C21-C27) Passenger Level",
      "Satellite Building",
      "Kuala Lumpur International Airport Terminal 1",
    ],
    coordinates: {
      lat: 2.7456,
      lng: 101.7072,
    },
    hours: ["24 hours daily"],
    id: "klia-1",
    label: "Airport Boutique",
    phone: "+6011 23885163",
    title: "KLIA 1",
  },
  {
    addressLines: [
      "G-20 & G-21 The Campus",
      "Batu 5 Jalan Kerja Ayer Lama",
      "Ampang Jaya 68000 Selangor",
    ],
    coordinates: {
      lat: 3.1407,
      lng: 101.7627,
    },
    hours: ["10AM - 10PM daily"],
    id: "campus-ampang",
    label: "Lifestyle Store",
    phone: "+60 10-253 3317",
    title: "The Campus, Ampang",
  },
  {
    addressLines: ["Jalan Teluk Datai", "07000 Langkawi, Kedah"],
    coordinates: {
      lat: 6.4254,
      lng: 99.7054,
    },
    hours: ["9AM - 6PM", "Closed: Thursday"],
    id: "datai-langkawi",
    label: "Resort Boutique",
    phone: "+60175229152",
    title: "The Datai Langkawi",
  },
  {
    addressLines: ["Level 1, The Exchange TRX", "55188 Kuala Lumpur"],
    coordinates: {
      lat: 3.1415,
      lng: 101.7178,
    },
    hours: ["10AM - 10PM daily"],
    id: "seibu-trx",
    label: "Department Store",
    phone: "+60103605321",
    title: "Seibu The Exchange, TRX",
  },
];

const consignmentBoutiques = [
  "Four Season Kuala Lumpur",
  "The Datai Langkawi",
  "Pangkor Laut Resort",
  "Tanjung Jara Resort",
  "Cameron Highland Resort",
  "Sama-Sama Hotel, KLIA",
  "The Els Club Teluk Datai, Langkawi",
];

function phoneToHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

function boutiqueToMapsHref(location: BoutiqueLocation) {
  const query = [`Kapten Batik ${location.title}`, ...location.addressLines].join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(
  a: {
    lat: number;
    lng: number;
  },
  b: {
    lat: number;
    lng: number;
  },
) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

export function ContactPage() {
  const [selectedBoutique, setSelectedBoutique] = useState(boutiqueLocations[0].id);
  const [tracking, setTracking] = useState<ContactTrackingSnapshot | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Enable location to surface the nearest boutique.");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const manualSelectionRef = useRef(false);

  useEffect(() => {
    setTracking(getOrCreateContactTrackingSnapshot());
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationMessage("Location access is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nearestBoutique = boutiqueLocations.reduce((nearest, current) => {
          const nearestDistance = distanceKm(currentLocation, nearest.coordinates);
          const currentDistance = distanceKm(currentLocation, current.coordinates);

          return currentDistance < nearestDistance ? current : nearest;
        }, boutiqueLocations[0]);

        setUserLocation(currentLocation);
        setLocationMessage(`Nearest boutique found: ${nearestBoutique.title}`);

        if (!manualSelectionRef.current) {
          setSelectedBoutique(nearestBoutique.id);
        }
      },
      () => {
        setLocationMessage("We could not access your location. Use the selector to choose a store.");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 10 * 60 * 1000,
        timeout: 10000,
      },
    );
  }, []);

  const boutiqueOptions = useMemo(() => {
    if (!userLocation) {
      return boutiqueLocations;
    }

    return [...boutiqueLocations].sort(
      (a, b) => distanceKm(userLocation, a.coordinates) - distanceKm(userLocation, b.coordinates),
    );
  }, [userLocation]);

  const featuredBoutique =
    boutiqueLocations.find((location) => location.id === selectedBoutique) ?? boutiqueLocations[0];
  const featuredBoutiqueMapHref = boutiqueToMapsHref(featuredBoutique);
  const selectedDistance = userLocation ? distanceKm(userLocation, featuredBoutique.coordinates) : null;
  const isNearestFeatured = boutiqueOptions[0]?.id === featuredBoutique.id;

  const submitInquiry = async (formData: FormData) => {
    if (!tracking) {
      setStatus("Preparing your secure submission. Please try again in a moment.");
      return;
    }

    const payload = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      type ContactInquiryApiSuccess = {
        emailConfigured: boolean;
        emailSent: boolean;
        emailStatus: {
          attempted: boolean;
          configured: boolean;
          sent: boolean;
          warnings: string[];
        };
        leadId: string;
        success: true;
        warnings: string[];
        whatsappMessage: string | null;
        whatsappRedirectReady: boolean;
        whatsappUrl: string | null;
      };
      type ContactInquiryApiFailure = {
        error: string;
        success: false;
      };
      type ContactInquiryApiResult = ContactInquiryApiSuccess | ContactInquiryApiFailure;

      const result = (await response.json()) as ContactInquiryApiResult;

      if (!response.ok || !result.success) {
        setStatus(!result.success && result.error ? result.error : "We could not submit your request right now.");
        return;
      }

      pushLeadFormSubmitSuccessTracking({
        formName: "contact_us",
        leadId: result.leadId,
        tracking,
      });

      if (result.whatsappRedirectReady && result.whatsappUrl) {
        window.location.replace(result.whatsappUrl);
        return;
      }

      setStatus("Your lead was saved, but WhatsApp is not ready right now.");
    } catch {
      setStatus("We could not submit your request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitInquiry(new FormData(event.currentTarget));
  };

  return (
    <main className={styles.page}>
      <SiteHeader contactHref="/contact-us" logoHref="/" />

      <div className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBackground} aria-hidden="true">
            <div className={`${styles.heroSlide} ${styles.heroSlide01}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide02}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide03}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide04}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide05}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide06}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide07}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide08}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide09}`} />
            <div className={`${styles.heroSlide} ${styles.heroSlide10}`} />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroLogoWrap}>
            <img
              alt="Kapten Batik logo"
              className={styles.heroLogo}
              src="/reference-assets/images/kapten-batik-logo-live.png"
            />
          </div>
          <p className={styles.heroQuote}>"Traditional Soul. Contemporary Spirit."</p>
        </section>

        <section className={styles.inquirySection}>
          <div className={styles.inquiryIntro}>
            <p className={styles.eyebrow}>Kapten Batik Inquiry Form</p>
            <h2>Direct Inquiry</h2>
            <p className={styles.formLead}>
              Leave a message and our lead consultant will respond within 24 hours.
            </p>
          </div>

          <form action="/api/leads" className={styles.inquiryForm} method="post" onSubmit={handleSubmit}>
            {tracking ? (
              <>
                <input name="capturedAt" type="hidden" value={tracking.capturedAt} />
                <input name="clickId" type="hidden" value={tracking.clickId} />
                <input name="fbclid" type="hidden" value={tracking.fbclid} />
                <input name="gclid" type="hidden" value={tracking.gclid} />
                <input name="landingPage" type="hidden" value={tracking.landingPage} />
                <input name="landingPagePath" type="hidden" value={tracking.landingPagePath} />
                <input name="msclkid" type="hidden" value={tracking.msclkid} />
                <input name="pageHistory" type="hidden" value={tracking.pageHistory} />
                <input name="pagePath" type="hidden" value={tracking.pagePath} />
                <input name="pageUrl" type="hidden" value={tracking.pageUrl} />
                <input name="referrer" type="hidden" value={tracking.referrer} />
                <input name="sessionId" type="hidden" value={tracking.sessionId} />
                <input name="trackingSessionId" type="hidden" value={tracking.trackingSessionId} />
                <input name="ttclid" type="hidden" value={tracking.ttclid} />
                <input name="utmCampaign" type="hidden" value={tracking.utmCampaign} />
                <input name="utmContent" type="hidden" value={tracking.utmContent} />
                <input name="utmMedium" type="hidden" value={tracking.utmMedium} />
                <input name="utmSource" type="hidden" value={tracking.utmSource} />
                <input name="utmTerm" type="hidden" value={tracking.utmTerm} />
              </>
            ) : null}
            <div className={styles.twoUp}>
              <div className={styles.field}>
                <label htmlFor="contact-name">Full Name</label>
                <input
                  autoComplete="name"
                  id="contact-name"
                  name="fullName"
                  placeholder="e.g. Julian Tan"
                  required
                  type="text"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email">Email Address</label>
                <input
                  autoComplete="email"
                  id="contact-email"
                  name="email"
                  placeholder="julian@example.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-type">Inquiry Type</label>
              <select defaultValue="Personal Styling" id="contact-type" name="type">
                <option>Personal Styling</option>
                <option>Bespoke Tailoring Appointment</option>
                <option>Private Viewing</option>
                <option>Heritage Consultation</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we assist your journey?"
                required
              />
            </div>

            <p className={styles.formFootnote}>
              For faster replies, do contact our Customer Careline through{" "}
              <a href="http://wa.me/60183814392" rel="noreferrer" target="_blank">
                WhatsApp here.
              </a>
            </p>

            <button className={styles.submitButton} disabled={isSubmitting} type="submit">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {status ? <p className={styles.status}>{status}</p> : null}
          </form>
        </section>

        <section className={styles.boutiqueShowcase}>
          <div className={styles.boutiqueHeader}>
            <div>
              <p className={styles.eyebrow}>Find Our Boutiques</p>
              <h2>Our Boutique Network</h2>
              <p>
                Explore every Kapten Batik flagship, lifestyle store, department
                store, and resort destination from one curated selector. Choose a
                location to see its full address, hours, and direct contact details.
              </p>
            </div>
            <a
              className={styles.directoryLink}
              href={allStoreLocationsHref}
              rel="noreferrer"
              target="_blank"
            >
              Open All Store Locations
            </a>
          </div>

          <div className={styles.featuredBoutiqueCard}>
            <div className={styles.featuredBoutiqueTop}>
              <div>
                <span className={styles.storeMeta}>
                  {isNearestFeatured ? "Nearest Store" : "Featured Boutique"}
                </span>
                <h3>{featuredBoutique.title}</h3>
                {locationMessage ? <p className={styles.locationHint}>{locationMessage}</p> : null}
              </div>

              <div className={styles.featuredSelector}>
                <label htmlFor="boutique-selector">Jump to location</label>
                <select
                  id="boutique-selector"
                  onChange={(event) => {
                    manualSelectionRef.current = true;
                    setSelectedBoutique(event.target.value);
                  }}
                  value={selectedBoutique}
                >
                  {boutiqueOptions.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.featuredBoutiqueBody}>
              <div className={styles.featuredAddress}>
                <div className={styles.featuredColumnHeader}>
                  <span className={styles.infoLabel}>Store Address</span>
                  <span className={styles.locationBadge}>{featuredBoutique.label}</span>
                </div>
                <div className={styles.addressStack}>
                  {featuredBoutique.addressLines.map((line) => (
                    <p key={`${featuredBoutique.id}-${line}`}>{line}</p>
                  ))}
                </div>
                <div className={styles.inlineActions}>
                  <a
                    className={styles.secondaryAction}
                    href={featuredBoutiqueMapHref}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Navigate
                  </a>
                  <a
                    className={styles.secondaryAction}
                    href={phoneToHref(featuredBoutique.phone)}
                  >
                    Call Boutique
                  </a>
                </div>
              </div>

              <div className={styles.featuredInfo}>
                <div className={styles.featuredInfoCard}>
                  <span className={styles.infoLabel}>Telephone</span>
                  <a className={styles.infoValue} href={phoneToHref(featuredBoutique.phone)}>
                    {featuredBoutique.phone}
                  </a>
                </div>
                <div className={styles.featuredInfoCard}>
                  <span className={styles.infoLabel}>Operating Hours</span>
                  {featuredBoutique.hours.map((line) => (
                    <p className={styles.infoValue} key={`${featuredBoutique.id}-${line}`}>
                      {line}
                    </p>
                  ))}
                </div>
                {featuredBoutique.note ? (
                  <div className={styles.featuredInfoCard}>
                    <span className={styles.infoLabel}>Notes</span>
                    <p className={styles.infoValue}>{featuredBoutique.note}</p>
                  </div>
                ) : null}
                {selectedDistance !== null ? (
                  <div className={styles.featuredInfoCard}>
                    <span className={styles.infoLabel}>Distance From You</span>
                    <p className={styles.infoValue}>
                      {selectedDistance < 1
                        ? "Less than 1 km away"
                        : `${selectedDistance.toFixed(1)} km away`}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.networkSummary}>
              <article className={styles.networkStat}>
                <span>{boutiqueLocations.length}</span>
                <p>Active boutiques and department store counters across Malaysia.</p>
              </article>
              <article className={styles.networkStat}>
                <span>{consignmentBoutiques.length}</span>
                <p>Resort and hotel partners available for destination discovery.</p>
              </article>
              <article className={styles.networkStat}>
                <span>1 Tap</span>
                <p>Open the full Kapten Batik network instantly in Google Maps.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.mapSection}>
          <div className={styles.mapCardWrap}>
            <div className={styles.mapCard}>
              <span className={styles.mapTag}>Visit Us</span>
              <div className={styles.mapContent}>
                <h2>
                  Experience
                  <br />
                  Kapten Batik
                </h2>
                <p>
                  Discover the tactile beauty of our heritage collections across
                  Malaysia. Our boutiques offer personalized styling and a closer
                  experience of the Kapten Batik world.
                </p>
              </div>
              <a
                className={styles.mapLink}
                href={allStoreLocationsHref}
                rel="noreferrer"
                target="_blank"
              >
                All Store Locations
              </a>
            </div>
          </div>
        </section>
      </div>

      <StandardFooter brandHref="/" contactHref="/contact-us" />
    </main>
  );
}
