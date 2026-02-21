"use client";

import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import styles from "./ServicesSection.module.css";

type OfferFeature = {
	summary: string;
	detail: string;
};

type ServiceOffer = {
	name: string;
	scope: string;
	description: string;
	features: OfferFeature[];
};

const offersByLanguage: Record<AppLanguage, ServiceOffer[]> = {
	pl: [
		{
			name: "Strony firmowe",
			scope: "Wizerunek + leady + SEO",
			description: "Kompleksowa strona uslugowa od UX i tresci po wdrozenie i opieke.",
			features: [
				{
					summary: "Nowoczesny design i szybki frontend.",
					detail:
						"Projektuje i wdrazam w Next.js z naciskiem na szybkosc, czytelnosc i premium odbior marki.",
				},
				{
					summary: "Struktura podstron pod cel biznesowy.",
					detail:
						"Uklad planuje pod realny cel: pozyskanie leadow, prezentacja oferty, budowanie zaufania i kontakt.",
				},
				{
					summary: "Latwa edycja tresci i ofert.",
					detail:
						"Wdrazam prosty panel, dzieki ktoremu mozesz samodzielnie aktualizowac tresci bez wsparcia developera.",
				},
				{
					summary: "SEO techniczne, domena i SSL.",
					detail:
						"Konfiguruje podstawy widocznosci w Google oraz bezpieczne, poprawne dzialanie calej infrastruktury.",
				},
			],
		},
		{
			name: "Sklepy e-commerce",
			scope: "Medusa.js / WooCommerce / custom",
			description: "Sklep od MVP po bardziej zlozone wdrozenie, bez szablonowego podejscia.",
			features: [
				{
					summary: "Checkout i koszyk pod Twoj model sprzedazy.",
					detail:
						"Tworze flow zakupowy dopasowany do produktu, marzy i strategii, zamiast gotowego szablonu 1:1.",
				},
				{
					summary: "Integracje platnosci, kurierow i narzedzi.",
					detail:
						"Lacze sklep z systemami, z ktorych korzystasz: platnosci, logistyka, CRM, marketing i analityka.",
				},
				{
					summary: "Wydajnosc i skalowanie katalogu.",
					detail:
						"Optymalizuje listingi, zdjecia i warstwe danych, aby sklep trzymal tempo przy wiekszym ruchu i ofercie.",
				},
				{
					summary: "Przejecie opieki technicznej po starcie.",
					detail:
						"Moge przejac utrzymanie, poprawki i rozwoj, zeby Twoj zespol skupil sie na sprzedazy, nie na bugach.",
				},
			],
		},
		{
			name: "Wdrozenia AI",
			scope: "Automatyzacje + AI dla procesu",
			description: "Automatyzuje powtarzalne zadania i wdrazam AI tam, gdzie daje realna oszczednosc czasu.",
			features: [
				{
					summary: "Automatyzacje zapytan i kwalifikacji leadow.",
					detail:
						"Buduje scenariusze, ktore porzadkuja dane z formularzy, nadaja priorytet leadom i przyspieszaja odpowiedzi.",
				},
				{
					summary: "Asystenci AI pod konkretne use-case.",
					detail:
						"Wdrazam AI do zadan praktycznych: obsluga zapytan, pomoc sprzedazowa, drafty tresci i operacje wewnetrzne.",
				},
				{
					summary: "Integracje z Twoim obecnym stackiem.",
					detail:
						"Lacze automatyzacje z narzedziami, ktore juz masz, aby uniknac chaosu i dublowania pracy zespolu.",
				},
				{
					summary: "Bezpieczne wdrozenie i kontrola procesu.",
					detail:
						"Ustalam zasady, monitoring i ograniczenia, zeby AI wspieralo firme, a nie tworzylo ryzyko operacyjne.",
				},
			],
		},
	],
	en: [
		{
			name: "Business websites",
			scope: "Brand + leads + SEO",
			description: "End-to-end service website delivery: UX, content, development, launch and support.",
			features: [
				{
					summary: "Modern design and fast frontend.",
					detail:
						"I design and build in Next.js with a strong focus on speed, readability and premium brand perception.",
				},
				{
					summary: "Page structure aligned with business goals.",
					detail:
						"The structure is planned around outcomes: lead capture, offer presentation, trust and easy contact.",
				},
				{
					summary: "Easy content and offer management.",
					detail:
						"I implement a simple admin flow so your team can update content without relying on a developer.",
				},
				{
					summary: "Technical SEO, domain and SSL.",
					detail:
						"I configure core Google visibility and secure infrastructure setup for stable production use.",
				},
			],
		},
		{
			name: "E-commerce stores",
			scope: "Medusa.js / WooCommerce / custom",
			description: "Store delivery from MVP to advanced setups, without template-only limitations.",
			features: [
				{
					summary: "Checkout and cart tailored to your model.",
					detail:
						"I build purchase flows around your product and strategy instead of forcing a generic template.",
				},
				{
					summary: "Payments, shipping and tool integrations.",
					detail:
						"I connect your store with payments, logistics, CRM, marketing tools and analytics stack.",
				},
				{
					summary: "Performance and catalog scalability.",
					detail:
						"I optimize listing pages, images and data layer so the store keeps up with larger traffic and catalog.",
				},
				{
					summary: "Technical ownership after launch.",
					detail:
						"I can own maintenance, fixes and feature growth so your team can stay focused on sales.",
				},
			],
		},
		{
			name: "AI implementations",
			scope: "Automation + AI workflows",
			description: "I automate repetitive operations and implement AI where it creates measurable time savings.",
			features: [
				{
					summary: "Lead intake and qualification automations.",
					detail:
						"I build scenarios that clean form data, prioritize leads and accelerate response handling.",
				},
				{
					summary: "AI assistants for concrete use cases.",
					detail:
						"I deploy AI for practical operations: inquiry handling, sales support, drafts and internal workflows.",
				},
				{
					summary: "Integrations with your current stack.",
					detail:
						"I connect automations with tools you already use to avoid process chaos and duplicated work.",
				},
				{
					summary: "Safe rollout and process control.",
					detail:
						"I set guardrails, monitoring and usage boundaries so AI supports the business without operational risk.",
				},
			],
		},
	],
};

const sectionCopyByLanguage: Record<
	AppLanguage,
	{
		eyebrow: string;
		ctaButton: string;
		ctaText: string;
		badge: string;
		showDetails: string;
	}
> = {
	pl: {
		eyebrow: "Uslugi",
		ctaButton: "Darmowa konsultacja i wycena",
		ctaText: "Przestan tracic potencjalnych klientow przez zepsuty workflow.",
		badge: "Wycena indywidualna",
		showDetails: "Pokaz szczegoly",
	},
	en: {
		eyebrow: "Services",
		ctaButton: "Free consultation and estimate",
		ctaText: "Stop losing potential clients because of a broken workflow.",
		badge: "Custom quote",
		showDetails: "Show details",
	},
};

export default function ServicesSection() {
	const { language } = useLanguage();
	const sectionCopy = sectionCopyByLanguage[language];
	const serviceOffers = offersByLanguage[language];

	return (
		<section id="uslugi" className={`page-section ${styles.section}`}>
			<div className={`page-section-inner ${styles.inner}`}>
				<p className="page-section-eyebrow">{sectionCopy.eyebrow}</p>

				<div className={styles.pricingGrid}>
					{serviceOffers.map((offer) => (
						<article key={offer.name} className={styles.pricingCard}>
							<p className={styles.cardScope}>{offer.scope}</p>
							<h3>{offer.name}</h3>
							<p className={styles.cardDescription}>{offer.description}</p>

							<ul className={styles.featureList}>
								{offer.features.map((feature) => (
									<li key={feature.summary} className={styles.featureItem}>
										<span className={styles.featureText}>{feature.summary}</span>
										<span className={styles.hintWrap}>
											<span className={styles.featureHint} tabIndex={0} aria-label={sectionCopy.showDetails}>
												i
											</span>
											<span className={styles.featureTooltip}>{feature.detail}</span>
										</span>
									</li>
								))}
							</ul>

							<span className={styles.cardBadge}>{sectionCopy.badge}</span>
						</article>
					))}
				</div>

				<div className={styles.ctaRow}>
					<a href="#kontakt" className={styles.ctaButton}>
						{sectionCopy.ctaButton}
					</a>
					<p>{sectionCopy.ctaText}</p>
				</div>
			</div>
		</section>
	);
}

