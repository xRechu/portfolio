"use client";

import styles from "./ServicesSection.module.css";

const servicePillars = [
	{
		title: "Nowoczesna technologia i UX",
		description:
			"Next.js, responsywny design i przemyślana struktura podstron. Projekt jest szybki, czytelny i gotowy na rozwój.",
	},
	{
		title: "Łatwe zarządzanie treścią",
		description:
			"Wdrażam prosty panel do ofert, treści i zdjęć. Możesz działać samodzielnie albo delegować to do mnie w modelu opieki.",
	},
	{
		title: "Bezpieczeństwo i infrastruktura",
		description:
			"Konfiguracja domeny, SSL, ochrona i stabilny hosting. Strona działa niezawodnie i jest gotowa na większy ruch.",
	},
	{
		title: "Widoczność i wydajność",
		description:
			"Podstawy SEO technicznego, szybkie ładowanie i optymalizacja zdjęć. Dzięki temu użytkownik i Google widzą jakość.",
	},
	{
		title: "Leady, kontakt i wymogi prawne",
		description:
			"Formularze kontaktowe, integracje map i wdrożenie banera cookies. Strona wspiera sprzedaż i spełnia standardy.",
	},
	{
		title: "Wdrożenie i opieka po starcie",
		description:
			"Terminowa publikacja, szkolenie z obsługi i wsparcie po uruchomieniu. Możesz rosnąć bez chaosu technicznego.",
	},
];

const servicePackages = [
	{
		name: "Strona firmowa",
		scope: "Wizerunek + leady + SEO",
		notes: "Dla usług lokalnych i marek osobistych.",
	},
	{
		name: "E-commerce",
		scope: "Medusa.js / WooCommerce / custom",
		notes: "Sklepy od MVP po bardziej złożone wdrożenia.",
	},
	{
		name: "Automatyzacje i AI",
		scope: "Procesy, integracje i oszczędność czasu",
		notes: "Rozwiązania szyte pod konkretny workflow.",
	},
];

export default function ServicesSection() {
	return (
		<section id="uslugi" className={`page-section ${styles.section}`}>
			<div className={`page-section-inner ${styles.inner}`}>
				<p className="page-section-eyebrow">Uslugi</p>
				<h2 className="page-section-title">Kompleksowo: od pomyslu po wdrozenie i opieke</h2>
				<p className="page-section-description">
					Nie pracuje na sztywnym cenniku, bo kazdy projekt ma inny zakres. Zamiast tego dostajesz konkretna
					propozycje: zakres, etapy i realna wycene pod Twoj cel.
				</p>

				<div className={styles.notice}>
					<p>
						Wycena jest indywidualna, ale realizacja zawsze obejmuje kwestie techniczne, biznesowe i
						utrzymaniowe, zebys nie musial skladac projektu z kilku wykonawcow.
					</p>
				</div>

				<div className={styles.pillarGrid}>
					{servicePillars.map((pillar) => (
						<article key={pillar.title} className={styles.pillarCard}>
							<h3>{pillar.title}</h3>
							<p>{pillar.description}</p>
						</article>
					))}
				</div>

				<div className={styles.packageGrid}>
					{servicePackages.map((servicePackage) => (
						<article key={servicePackage.name} className={styles.packageCard}>
							<p className={styles.packageScope}>{servicePackage.scope}</p>
							<h3>{servicePackage.name}</h3>
							<p>{servicePackage.notes}</p>
							<span className={styles.packageBadge}>Wycena indywidualna</span>
						</article>
					))}
				</div>

				<div className={styles.ctaRow}>
					<a href="#kontakt" className={styles.ctaButton}>
						Umow bezplatna konsultacje
					</a>
					<p>Po rozmowie dostajesz jasny plan i estymacje bez zobowiazan.</p>
				</div>
			</div>
		</section>
	);
}
