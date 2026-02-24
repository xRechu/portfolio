"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import jakubPortrait from "@/assets/jakub-reszka.webp";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import DeferredClientSection from "@/components/DeferredClientSection";
import SectionRail from "@/components/SectionRail";
import TopControls from "@/components/TopControls";
import { clearStoredConsent } from "@/lib/consent";

type ContentSection = {
	id: string;
	eyebrow: string;
	title?: string;
	description?: string;
	points?: string[];
};

type FaqItem = {
	id: string;
	question: string;
	answer: string;
};

const sectionNavigationByLanguage: Record<AppLanguage, { id: string; label: string }[]> = {
	pl: [
		{ id: "start", label: "Start" },
		{ id: "realizacje", label: "Realizacje" },
		{ id: "uslugi", label: "Usługi" },
		{ id: "dlaczego-ja", label: "Dlaczego ja" },
		{ id: "faq", label: "FAQ" },
		{ id: "kontakt", label: "Kontakt" },
	],
	en: [
		{ id: "start", label: "Start" },
		{ id: "realizacje", label: "Projects" },
		{ id: "uslugi", label: "Services" },
		{ id: "dlaczego-ja", label: "Why me" },
		{ id: "faq", label: "FAQ" },
		{ id: "kontakt", label: "Contact" },
	],
};

const contentSectionsByLanguage: Record<AppLanguage, ContentSection[]> = {
	pl: [
		{
			id: "dlaczego-ja",
			eyebrow: "Dlaczego ja",
			title: "Partner technologiczny skupiony na wynikach",
			description:
				"Łączę strategię, design i development w jeden proces, żeby Twoja strona generowała leady, a nie tylko robiła wrażenie wizualne.",
			points: [
				"Szybka realizacja: działam sprawnie i dowożę projekt bez przeciągania terminów.",
				"Zaawansowane strony i sklepy: Next.js, Medusa.js, WooCommerce oraz custom rozwiązania.",
				"Kompleksowa usługa end-to-end: od strategii i UX po wdrożenie, SEO techniczne i bezpieczeństwo.",
				"Elastyczna współpraca: możliwość negocjacji zakresu, budżetu i etapowania projektu.",
			],
		},
	],
	en: [
		{
			id: "dlaczego-ja",
			eyebrow: "Why me",
			title: "A technical partner focused on outcomes",
			description:
				"I combine strategy, design and engineering into one delivery flow so your website generates leads, not just visual impressions.",
			points: [
				"Fast delivery: efficient execution without dragging timelines.",
				"Advanced websites and stores: Next.js, Medusa.js, WooCommerce and custom features.",
				"End-to-end scope: strategy, UX, implementation, technical SEO and security.",
				"Flexible collaboration: negotiable scope, budget and phased rollout.",
			],
		},
	],
};

const faqByLanguage: Record<
	AppLanguage,
	{
		eyebrow: string;
		title?: string;
		description?: string;
		items: FaqItem[];
	}
> = {
	pl: {
		eyebrow: "FAQ",
		items: [
			{
				id: "design-only",
				question: "Czy mogę zamówić sam projekt graficzny?",
				answer: "Tak. Mogę przygotować sam projekt UI/UX bez wdrożenia, wraz z makietą i style guide.",
			},
			{
				id: "edit-content",
				question: "Czy mogę edytować treści na stronie samodzielnie?",
				answer: "Tak. Wdrażam prosty panel administracyjny, dzięki któremu samodzielnie zmienisz treści i ofertę.",
			},
			{
				id: "timeline",
				question: "Ile trwa stworzenie strony?",
				answer: "Najczęściej od 2 do 6 tygodni, zależnie od zakresu, materiałów i liczby integracji.",
			},
			{
				id: "integrations",
				question: "Czy oferujesz integracje z narzędziami zewnętrznymi?",
				answer: "Tak. Integruję m.in. płatności, logistykę, CRM, newsletter, analitykę i automatyzacje AI.",
			},
			{
				id: "support",
				question: "Czy mogę liczyć na wsparcie po zakończeniu projektu?",
				answer: "Tak. Mogę przejąć opiekę techniczną, aktualizacje, poprawki i dalszy rozwój projektu.",
			},
			{
				id: "pricing",
				question: "Jaki koszt?",
				answer: "Wycena jest indywidualna. Po krótkiej konsultacji dostajesz zakres, etapy i konkretną wycenę.",
			},
		],
	},
	en: {
		eyebrow: "FAQ",
		items: [
			{
				id: "design-only",
				question: "Can I order design only?",
				answer: "Yes. I can deliver standalone UI/UX design with wireframes and a style guide.",
			},
			{
				id: "edit-content",
				question: "Can I edit website content on my own?",
				answer: "Yes. I implement a simple admin flow so you can update content and offers without developer help.",
			},
			{
				id: "timeline",
				question: "How long does delivery take?",
				answer: "Usually 2 to 6 weeks, depending on scope, content readiness and required integrations.",
			},
			{
				id: "integrations",
				question: "Do you integrate external tools?",
				answer: "Yes. I integrate payments, shipping, CRM, newsletter, analytics and AI automation tools.",
			},
			{
				id: "support",
				question: "Do you provide post-launch support?",
				answer: "Yes. I can handle maintenance, updates, fixes and further feature development.",
			},
			{
				id: "pricing",
				question: "What is the cost?",
				answer: "Pricing is custom. After a short consultation you get scope, milestones and a clear quote.",
			},
		],
	},
};

const footerCopyByLanguage: Record<
	AppLanguage,
	{
		rights: string;
		blog: string;
		blogHref: string;
		privacy: string;
		privacyHref: string;
		terms: string;
		termsHref: string;
		cookies: string;
	}
> = {
	pl: {
		rights: "Wszelkie prawa zastrzeżone.",
		blog: "Blog",
		blogHref: "/blog",
		privacy: "Polityka prywatności",
		privacyHref: "/polityka-prywatnosci",
		terms: "Regulamin",
		termsHref: "/regulamin",
		cookies: "Ustawienia cookies",
	},
	en: {
		rights: "All rights reserved.",
		blog: "Blog",
		blogHref: "/en/blog",
		privacy: "Privacy policy",
		privacyHref: "/en/polityka-prywatnosci",
		terms: "Terms",
		termsHref: "/en/regulamin",
		cookies: "Cookie settings",
	},
};

const deferredSectionFallbackByLanguage: Record<
	AppLanguage,
	{
		realizations: string;
		services: string;
		contact: string;
	}
> = {
	pl: {
		realizations: "Realizacje",
		services: "Usługi",
		contact: "Kontakt",
	},
	en: {
		realizations: "Projects",
		services: "Services",
		contact: "Contact",
	},
};

const loadRealizationsSection = () => import("@/components/RealizationsSection");
const loadServicesSection = () => import("@/components/ServicesSection");
const loadContactSection = () => import("@/components/ContactSection");

export default function Home() {
	const { language } = useLanguage();
	const sectionNavigation = sectionNavigationByLanguage[language];
	const contentSections = contentSectionsByLanguage[language];
	const faq = faqByLanguage[language];
	const footerCopy = footerCopyByLanguage[language];
	const deferredSectionFallback = deferredSectionFallbackByLanguage[language];
	const [openFaqId, setOpenFaqId] = useState<string | null>(null);

	useEffect(() => {
		setOpenFaqId(null);
	}, [faq]);

	const handleCookieSettingsClick = () => {
		clearStoredConsent();
	};

	return (
		<main>
			<a
				href="#start"
				className="brand-wordmark"
				aria-label={language === "pl" ? "Przejdź do sekcji startowej" : "Go to hero section"}
			>
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · Mobile Apps · AI</span>
			</a>
			<TopControls />

			<SectionRail sections={sectionNavigation} />

			<Hero />
			<DeferredClientSection
				sectionId="realizacje"
				loader={loadRealizationsSection}
				fallbackEyebrow={deferredSectionFallback.realizations}
				minHeight={860}
			/>
			<DeferredClientSection
				sectionId="uslugi"
				loader={loadServicesSection}
				fallbackEyebrow={deferredSectionFallback.services}
				minHeight={760}
			/>

			{contentSections.map((section) => {
				const isWhyMeSection = section.id === "dlaczego-ja";
				const pointsList =
					section.points && section.points.length > 0 ? (
						<ul className={`page-section-points${isWhyMeSection ? " why-me-points" : ""}`}>
							{section.points.map((point) => (
								<li key={point}>{point}</li>
							))}
						</ul>
					) : null;

				return (
					<section key={section.id} id={section.id} className="page-section">
						<div className={`page-section-inner ${isWhyMeSection ? "why-me-section-inner" : ""}`}>
							{isWhyMeSection ? (
								<>
									<div className="why-me-content">
										<p className="page-section-eyebrow">{section.eyebrow}</p>
										{section.title ? <h2 className="page-section-title">{section.title}</h2> : null}
										{section.description ? <p className="page-section-description">{section.description}</p> : null}
									</div>
									<aside className="why-me-photo-wrap" aria-hidden="true">
										<div className="why-me-photo-shell">
											<Image
												src={jakubPortrait}
												alt=""
												className="why-me-photo"
												sizes="(max-width: 700px) 140px, (max-width: 1023px) 180px, 220px"
											/>
										</div>
									</aside>
									{pointsList}
								</>
							) : (
								<div>
									<p className="page-section-eyebrow">{section.eyebrow}</p>
									{section.title ? <h2 className="page-section-title">{section.title}</h2> : null}
									{section.description ? <p className="page-section-description">{section.description}</p> : null}
									{pointsList}
								</div>
							)}
						</div>
					</section>
				);
			})}

			<section id="faq" className="page-section faq-section">
				<div className="page-section-inner">
					<p className="page-section-eyebrow">{faq.eyebrow}</p>
					{faq.title ? <h2 className="page-section-title">{faq.title}</h2> : null}
					{faq.description ? <p className="page-section-description">{faq.description}</p> : null}

					<div className="faq-list">
						{faq.items.map((item) => {
							const isOpen = openFaqId === item.id;
							const answerId = `faq-answer-${item.id}`;

							return (
								<article key={item.id} className={`faq-item ${isOpen ? "is-open" : ""}`}>
									<h3 className="faq-question-wrap">
										<button
											type="button"
											className="faq-question"
											aria-expanded={isOpen}
											aria-controls={answerId}
											onClick={() => setOpenFaqId((current) => (current === item.id ? null : item.id))}
										>
											<span>{item.question}</span>
											<span className={`faq-toggle ${isOpen ? "is-open" : ""}`} aria-hidden="true">
												{isOpen ? "−" : "+"}
											</span>
										</button>
									</h3>
									<div id={answerId} className="faq-answer" hidden={!isOpen}>
										<p>{item.answer}</p>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			</section>

			<DeferredClientSection
				sectionId="kontakt"
				loader={loadContactSection}
				fallbackEyebrow={deferredSectionFallback.contact}
				minHeight={760}
			/>

			<footer className="site-legal-footer">
				<p className="site-legal-footer-copy">
					© {new Date().getFullYear()} Jakub Reszka. {footerCopy.rights}
				</p>
				<div className="site-legal-footer-links">
					<Link href={footerCopy.blogHref}>{footerCopy.blog}</Link>
					<Link href={footerCopy.privacyHref}>{footerCopy.privacy}</Link>
					<Link href={footerCopy.termsHref}>{footerCopy.terms}</Link>
					<button type="button" onClick={handleCookieSettingsClick}>
						{footerCopy.cookies}
					</button>
				</div>
			</footer>
		</main>
	);
}
