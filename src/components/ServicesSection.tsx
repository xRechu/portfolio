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
			description: "Kompleksowa strona usługowa od UX i treści po wdrożenie i opiekę.",
			features: [
				{
					summary: "Nowoczesny design i szybki frontend.",
					detail:
						"Projektuję i wdrażam w Next.js z naciskiem na szybkość, czytelność i premium odbiór marki.",
				},
				{
					summary: "Struktura podstron pod cel biznesowy.",
					detail:
						"Układ planuję pod realny cel: pozyskanie leadów, prezentacja oferty, budowanie zaufania i kontakt.",
				},
				{
					summary: "Łatwa edycja treści i ofert.",
					detail:
						"Wdrażam prosty panel, dzięki któremu możesz samodzielnie aktualizować treści bez wsparcia developera.",
				},
				{
					summary: "SEO techniczne, domena i SSL.",
					detail:
						"Konfiguruję podstawy widoczności w Google oraz bezpieczne, poprawne działanie całej infrastruktury.",
				},
			],
		},
		{
			name: "Sklepy e-commerce",
			scope: "Medusa.js / WooCommerce / custom",
			description: "Sklep od MVP po bardziej złożone wdrożenie, bez szablonowego podejścia.",
			features: [
				{
					summary: "Checkout i koszyk pod Twój model sprzedaży.",
					detail:
						"Tworzę flow zakupowy dopasowany do produktu, marży i strategii, zamiast gotowego szablonu 1:1.",
				},
				{
					summary: "Integracje płatności, kurierów i narzędzi.",
					detail:
						"Łączę sklep z systemami, z których korzystasz: płatności, logistyka, CRM, marketing i analityka.",
				},
				{
					summary: "Wydajność i skalowanie katalogu.",
					detail:
						"Optymalizuję listingi, zdjęcia i warstwę danych, aby sklep trzymał tempo przy większym ruchu i ofercie.",
				},
				{
					summary: "Przejęcie opieki technicznej po starcie.",
					detail:
						"Mogę przejąć utrzymanie, poprawki i rozwój, żeby Twój zespół skupił się na sprzedaży, nie na bugach.",
				},
			],
		},
		{
			name: "Wdrożenia AI",
			scope: "Automatyzacje + AI dla procesu",
			description: "Automatyzuję powtarzalne zadania i wdrażam AI tam, gdzie daje realną oszczędność czasu.",
			features: [
				{
					summary: "Automatyzacje zapytań i kwalifikacji leadów.",
					detail:
						"Buduję scenariusze, które porządkują dane z formularzy, nadają priorytet leadom i przyspieszają odpowiedzi.",
				},
				{
					summary: "Asystenci AI pod konkretne use-case.",
					detail:
						"Wdrażam AI do zadań praktycznych: obsługa zapytań, pomoc sprzedażowa, drafty treści i operacje wewnętrzne.",
				},
				{
					summary: "Integracje z Twoim obecnym stackiem.",
					detail:
						"Łączę automatyzacje z narzędziami, które już masz, aby uniknąć chaosu i dublowania pracy zespołu.",
				},
				{
					summary: "Bezpieczne wdrożenie i kontrola procesu.",
					detail:
						"Ustalam zasady, monitoring i ograniczenia, żeby AI wspierało firmę, a nie tworzyło ryzyko operacyjne.",
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
		eyebrow: "Usługi",
		ctaButton: "Darmowa konsultacja i wycena",
		ctaText: "Przestań tracić potencjalnych klientów przez zepsuty workflow.",
		badge: "Wycena indywidualna",
		showDetails: "Pokaż szczegóły",
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
