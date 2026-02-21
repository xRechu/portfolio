import Hero from "@/components/Hero";
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

const sectionNavigation = [
	{ id: "start", label: "Start" },
	{ id: "realizacje", label: "Realizacje" },
	{ id: "uslugi", label: "Uslugi" },
	{ id: "dlaczego-ja", label: "Dlaczego ja" },
	{ id: "faq", label: "FAQ" },
	{ id: "kontakt", label: "Kontakt" },
];

const contentSections: ContentSection[] = [
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
	{
		id: "kontakt",
		eyebrow: "Kontakt",
		title: "Umow darmowa konsultacje i rusz z projektem",
		description:
			"Napisz, co chcesz zbudowac, a dostaniesz konkretny plan dzialania i wycene pod Twoj przypadek.",
		points: [
			"Ty opisujesz cel i problem, ktory blokuje sprzedaz lub leady.",
			"Ja proponuje najlepszy wariant technologii i zakres wdrozenia.",
			"Dostajesz estymacje czasu i kosztu bez zadnych zobowiazan.",
			"Startujemy dopiero, gdy wszystko jest jasne po obu stronach.",
		],
	},
];

export default function Home() {
	return (
		<main>
			<a href="#start" className="brand-wordmark" aria-label="Przejdz do sekcji startowej">
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
		</main>
	);
}
