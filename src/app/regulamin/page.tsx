"use client";

import Link from "next/link";
import TopControls from "@/components/TopControls";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import styles from "@/app/legal-pages.module.css";

type LegalSection = {
	title: string;
	paragraphs?: string[];
	points?: string[];
};

const termsContentByLanguage: Record<
	AppLanguage,
	{
		eyebrow: string;
		title: string;
		updatedAt: string;
		back: string;
		notice: string;
		sections: LegalSection[];
	}
> = {
	pl: {
		eyebrow: "Dokument prawny",
		title: "Regulamin serwisu",
		updatedAt: "Ostatnia aktualizacja: 21 lutego 2026 r.",
		back: "Wróć do strony głównej",
		notice: "Jakub Reszka; kontakt poprzez formularz dostępny na stronie głównej.",
		sections: [
			{
				title: "1. Postanowienia ogólne",
				paragraphs: [
					"Regulamin określa zasady korzystania z serwisu portfolio dostępnego pod domeną imienną Jakuba Reszki.",
					"Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.",
				],
			},
			{
				title: "2. Zakres usług",
				points: [
					"prezentacja oferty usługowej i realizacji,",
					"udostępnienie formularza kontaktowego do przesyłania zapytań,",
					"udostępnienie treści informacyjnych dotyczących współpracy.",
				],
			},
			{
				title: "3. Wymagania techniczne",
				points: [
					"urządzenie z dostępem do internetu,",
					"aktualna przeglądarka internetowa z włączoną obsługą JavaScript,",
					"aktywne konto e-mail, jeśli użytkownik chce skorzystać z formularza kontaktowego.",
				],
			},
			{
				title: "4. Zasady korzystania z formularza kontaktowego",
				points: [
					"użytkownik podaje dane zgodne ze stanem faktycznym,",
					"zakazane jest przesyłanie treści bezprawnych, obraźliwych, spamowych lub naruszających prawa osób trzecich,",
					"usługodawca może odmówić obsługi zgłoszenia naruszającego regulamin.",
				],
			},
			{
				title: "5. Prawa autorskie",
				paragraphs: [
					"Treści, materiały i elementy graficzne serwisu podlegają ochronie prawnej.",
					"Kopiowanie, rozpowszechnianie lub wykorzystywanie materiałów bez uprzedniej zgody usługodawcy jest zabronione, poza przypadkami dozwolonymi przepisami prawa.",
				],
			},
			{
				title: "6. Odpowiedzialność",
				points: [
					"usługodawca dokłada należytej staranności, aby serwis działał poprawnie i bezpiecznie,",
					"usługodawca nie ponosi odpowiedzialności za czasowe przerwy techniczne niezależne od niego,",
					"usługodawca nie odpowiada za skutki decyzji biznesowych podjętych na podstawie informacji zamieszczonych w serwisie.",
				],
			},
			{
				title: "7. Reklamacje",
				paragraphs: [
					"Reklamacje dotyczące działania serwisu można zgłaszać przez formularz kontaktowy dostępny w sekcji Kontakt.",
					"Zgłoszenie powinno zawierać opis problemu i dane kontaktowe umożliwiające odpowiedź.",
					"Reklamacje są rozpatrywane niezwłocznie, nie później niż w terminie 14 dni od otrzymania zgłoszenia.",
				],
			},
			{
				title: "8. Ochrona danych osobowych",
				paragraphs: [
					"Zasady przetwarzania danych osobowych opisuje Polityka prywatności.",
					"Korzystanie z formularza kontaktowego wiąże się z przetwarzaniem danych na zasadach wskazanych w tym dokumencie.",
				],
			},
			{
				title: "9. Postanowienia końcowe",
				paragraphs: [
					"Regulamin może być aktualizowany z ważnych przyczyn prawnych lub technicznych.",
					"Zmiany obowiązują od dnia publikacji nowej wersji regulaminu w serwisie.",
					"W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego oraz prawa Unii Europejskiej.",
				],
			},
		],
	},
	en: {
		eyebrow: "Legal document",
		title: "Website Terms",
		updatedAt: "Last updated: February 21, 2026.",
		back: "Back to homepage",
		notice: "Before publishing, complete full provider details (name, address and contact channel).",
		sections: [
			{
				title: "1. General provisions",
				paragraphs: [
					"These terms define the rules for using this personal portfolio website operated by Jakub Reszka.",
					"Using the website means acceptance of these terms.",
				],
			},
			{
				title: "2. Scope of services",
				points: [
					"presentation of services and project showcases,",
					"contact form for sending business inquiries,",
					"access to informational content related to cooperation.",
				],
			},
			{
				title: "3. Technical requirements",
				points: [
					"internet-enabled device,",
					"up-to-date web browser with JavaScript enabled,",
					"active email account if the user wants to submit the contact form.",
				],
			},
			{
				title: "4. Contact form rules",
				points: [
					"the user must provide accurate information,",
					"it is prohibited to submit unlawful, offensive, spam or rights-infringing content,",
					"the provider may refuse to process submissions that violate these terms.",
				],
			},
			{
				title: "5. Intellectual property",
				paragraphs: [
					"Website content, materials and visual elements are protected by law.",
					"Copying, distributing or reusing materials without prior consent is prohibited, except where permitted by law.",
				],
			},
			{
				title: "6. Liability",
				points: [
					"the provider uses reasonable efforts to keep the website secure and operational,",
					"the provider is not liable for temporary interruptions caused by external technical factors,",
					"the provider is not liable for business decisions made based on website information.",
				],
			},
			{
				title: "7. Complaints",
				paragraphs: [
					"Service-related complaints can be submitted through the contact form available in the Contact section.",
					"The complaint should include a description of the issue and contact details for response.",
					"Complaints are handled without undue delay, no later than 14 days after receipt.",
				],
			},
			{
				title: "8. Personal data protection",
				paragraphs: [
					"Rules for personal data processing are described in the Privacy Policy.",
					"Using the contact form involves data processing under those rules.",
				],
			},
			{
				title: "9. Final provisions",
				paragraphs: [
					"These terms may be updated due to legal or technical changes.",
					"Changes apply from the date the updated version is published.",
					"For matters not covered, Polish and European Union law applies.",
				],
			},
		],
	},
};

export default function TermsPage() {
	const { language } = useLanguage();
	const copy = termsContentByLanguage[language];
	const homeHref = language === "en" ? "/en" : "/";

	return (
		<main className={styles.legalPage}>
			<a href={homeHref} className="brand-wordmark" aria-label={copy.back}>
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>
			<TopControls />

			<div className={styles.legalPageInner}>
				<Link href={homeHref} className={styles.legalBackLink}>
					{copy.back}
				</Link>

				<header className={styles.legalPageHeader}>
					<p className={styles.legalPageEyebrow}>{copy.eyebrow}</p>
					<h1 className={styles.legalPageTitle}>{copy.title}</h1>
					<p className={styles.legalPageUpdated}>{copy.updatedAt}</p>
				</header>

				<div className={styles.legalPageAlert}>{copy.notice}</div>

				<div className={styles.legalSections}>
					{copy.sections.map((section) => (
						<section key={section.title} className={styles.legalSection}>
							<h2>{section.title}</h2>
							{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
							{section.points && section.points.length > 0 ? (
								<ul>
									{section.points.map((point) => (
										<li key={point}>{point}</li>
									))}
								</ul>
							) : null}
						</section>
					))}
				</div>
			</div>
		</main>
	);
}
