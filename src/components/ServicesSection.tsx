"use client";

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

const serviceOffers: ServiceOffer[] = [
	{
		name: "Strony firmowe",
		scope: "Wizerunek + leady + SEO",
		description:
			"Kompleksowa strona uslugowa od UX i tresci po wdrozenie i opieke.",
		features: [
			{
				summary: "Nowoczesny design i szybki frontend.",
				detail:
					"Projektuje i wdrazam w Next.js z naciskiem na szybkość, czytelnosc i premium odbior marki.",
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
					"Konfiguruję podstawy widocznosci w Google oraz bezpieczne, poprawne dzialanie calej infrastruktury.",
			},
		],
	},
	{
		name: "Sklepy e-commerce",
		scope: "Medusa.js / WooCommerce / custom",
		description:
			"Sklep od MVP po bardziej zlozone wdrozenie, bez szablonowego podejscia.",
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
		description:
			"Automatyzuje powtarzalne zadania i wdrazam AI tam, gdzie daje realna oszczednosc czasu.",
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
];

export default function ServicesSection() {
	return (
		<section id="uslugi" className={`page-section ${styles.section}`}>
			<div className={`page-section-inner ${styles.inner}`}>
				<p className="page-section-eyebrow">Uslugi</p>
				<h2 className="page-section-title">3 kierunki wspolpracy</h2>
				<p className="page-section-description">
					Zamiast sztywnego cennika dostajesz precyzyjny zakres i wycene pod projekt.
				</p>

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
											<span className={styles.featureHint} tabIndex={0} aria-label="Pokaz szczegoly">
												i
											</span>
											<span className={styles.featureTooltip}>{feature.detail}</span>
										</span>
									</li>
								))}
							</ul>

							<span className={styles.cardBadge}>Wycena indywidualna</span>
						</article>
					))}
				</div>

				<div className={styles.ctaRow}>
					<a href="#kontakt" className={styles.ctaButton}>
						Umow bezplatna konsultacje
					</a>
					<p>Po rozmowie dostajesz zakres, estymacje i rekomendowany wariant wdrozenia.</p>
				</div>
			</div>
		</section>
	);
}
