"use client";

import Hero from "@/components/Hero";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import ContactSection from "@/components/ContactSection";
import RealizationsSection from "@/components/RealizationsSection";
import SectionRail from "@/components/SectionRail";
import ServicesSection from "@/components/ServicesSection";
import TopControls from "@/components/TopControls";

type ContentSection = {
	id: string;
	eyebrow: string;
	title: string;
	description: string;
	points?: string[];
};

const sectionNavigationByLanguage: Record<AppLanguage, { id: string; label: string }[]> = {
	pl: [
		{ id: "start", label: "Start" },
		{ id: "realizacje", label: "Realizacje" },
		{ id: "uslugi", label: "Uslugi" },
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
			title: "Partner techniczny, ktory dowozi wynik",
			description:
				"Lacze strategie, design i development w jeden proces, zeby strona realnie zdobywala zapytania, a nie tylko ladnie wygladala.",
			points: [
				"Buduje pod konwersje i leady, nie pod efekt wow na jeden dzien.",
				"Lacze Next.js, e-commerce i automatyzacje AI w jednym wdrozeniu.",
				"Ogarniam calosc end-to-end: domena, SEO techniczne, analityka, bezpieczenstwo.",
				"Dostajesz konkret i szybkie decyzje, bez przeciagania projektu tygodniami.",
			],
		},
		{
			id: "faq",
			eyebrow: "FAQ",
			title: "Najczestsze pytania przed startem",
			description:
				"Zanim wydasz budzet, dostajesz jasne odpowiedzi o zakresie, terminie, kosztach i wsparciu po wdrozeniu.",
			points: [
				"Ile trwa realizacja? Najczesciej od 2 do 6 tygodni, zaleznie od zakresu.",
				"Czy dostajesz panel do edycji tresci? Tak, wdrazam prosty i czytelny CMS.",
				"Czy mozna zaczac od MVP? Tak, mozemy podzielic projekt na etapy.",
				"Czy wspieram po starcie? Tak, moge przejac utrzymanie i dalszy rozwoj.",
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
				"I build for conversion and qualified leads, not one-day visual wow.",
				"I combine Next.js, e-commerce and AI automation in one implementation.",
				"I handle delivery end-to-end: domain, technical SEO, analytics and security.",
				"You get clear decisions and fast execution without unnecessary delays.",
			],
		},
		{
			id: "faq",
			eyebrow: "FAQ",
			title: "Frequently asked questions before kickoff",
			description:
				"Before you commit budget, you get clear answers about scope, timeline, cost and post-launch support.",
			points: [
				"How long does delivery take? Usually 2 to 6 weeks depending on scope.",
				"Will I get a content editing panel? Yes, I implement a simple and clear CMS flow.",
				"Can we start from MVP? Yes, we can split the rollout into stages.",
				"Do you support after launch? Yes, I can handle maintenance and further development.",
			],
		},
	],
};

export default function Home() {
	const { language } = useLanguage();
	const sectionNavigation = sectionNavigationByLanguage[language];
	const contentSections = contentSectionsByLanguage[language];

	return (
		<main>
			<a
				href="#start"
				className="brand-wordmark"
				aria-label={language === "pl" ? "Przejdz do sekcji startowej" : "Go to hero section"}
			>
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>
			<TopControls />

			<SectionRail sections={sectionNavigation} />

			<Hero />
			<RealizationsSection />
			<ServicesSection />

			{contentSections.map((section) => (
				<section key={section.id} id={section.id} className="page-section">
					<div className="page-section-inner">
						<p className="page-section-eyebrow">{section.eyebrow}</p>
						<h2 className="page-section-title">{section.title}</h2>
						<p className="page-section-description">{section.description}</p>
						{section.points && section.points.length > 0 ? (
							<ul className="page-section-points">
								{section.points.map((point) => (
									<li key={point}>{point}</li>
								))}
							</ul>
						) : null}
					</div>
				</section>
			))}

			<ContactSection />
		</main>
	);
}
