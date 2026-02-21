import Hero from "@/components/Hero";
import RealizationsSection from "@/components/RealizationsSection";
import SectionRail from "@/components/SectionRail";
import ServicesSection from "@/components/ServicesSection";

const sectionNavigation = [
	{ id: "start", label: "Start" },
	{ id: "realizacje", label: "Realizacje" },
	{ id: "uslugi", label: "Uslugi" },
	{ id: "proces", label: "Proces" },
	{ id: "dlaczego-ja", label: "Dlaczego ja" },
	{ id: "faq", label: "FAQ" },
	{ id: "kontakt", label: "Kontakt" },
];

const contentSections = [
	{
		id: "proces",
		eyebrow: "Proces",
		title: "Prosty plan wspolpracy krok po kroku",
		description:
			"Krotko opisujesz etapy: analiza potrzeb, makieta, development, testy, wdrozenie i opieka. To buduje zaufanie i skraca czas decyzji klienta.",
	},
	{
		id: "dlaczego-ja",
		eyebrow: "Dlaczego ja",
		title: "Konkretne przewagi, nie ogolne hasla",
		description:
			"Wypunktujesz co Cie wyroznia: szybkie wdrozenia, dbalosc o performance, SEO, czytelna komunikacja i nacisk na wynik biznesowy.",
	},
	{
		id: "faq",
		eyebrow: "FAQ",
		title: "Najczestsze pytania klientow",
		description:
			"Stawki, terminy, zakres wsparcia, CMS, prawa autorskie i utrzymanie. Dobre FAQ zmniejsza opor przed kontaktem.",
	},
	{
		id: "kontakt",
		eyebrow: "Kontakt",
		title: "Call to action i formularz",
		description:
			"Prosty formularz + szybka obietnica odpowiedzi. Mozesz dodac tez opcje kontaktu przez e-mail i LinkedIn.",
	},
];

export default function Home() {
	return (
		<main>
			<a href="#start" className="brand-wordmark" aria-label="Przejdz do sekcji startowej">
				<span className="brand-wordmark-name">Imie Nazwisko</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>

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
					</div>
				</section>
			))}
		</main>
	);
}
