"use client";

import Link from "next/link";
import TopControls from "@/components/TopControls";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";

type LegalSection = {
	title: string;
	paragraphs?: string[];
	points?: string[];
};

const policyContentByLanguage: Record<
	AppLanguage,
	{
		eyebrow: string;
		title: string;
		updatedAt: string;
		back: string;
		sections: LegalSection[];
		notice: string;
	}
> = {
	pl: {
		eyebrow: "Dokument prawny",
		title: "Polityka prywatności",
		updatedAt: "Ostatnia aktualizacja: 21 lutego 2026 r.",
		back: "Wróć do strony głównej",
		notice:
			"Przed publikacją doprecyzuj dane administratora: imię i nazwisko (lub firmę), adres do kontaktu oraz kanał kontaktowy (formularz i/lub e-mail).",
		sections: [
			{
				title: "1. Administrator danych",
				paragraphs: [
					"Administratorem danych osobowych jest Jakub Reszka, prowadzący serwis portfolio pod domeną imienną.",
					"Kontakt w sprawach prywatności: formularz kontaktowy dostępny w sekcji Kontakt na stronie głównej.",
				],
			},
			{
				title: "2. Jakie dane przetwarzam",
				paragraphs: ["W ramach formularza kontaktowego mogę przetwarzać:"],
				points: [
					"imię i nazwisko,",
					"adres e-mail,",
					"numer telefonu,",
					"cel kontaktu i treść wiadomości,",
					"dane techniczne niezbędne do bezpieczeństwa (np. adres IP, identyfikator zapytania, czas wysłania).",
				],
			},
			{
				title: "3. Cele i podstawy prawne przetwarzania",
				points: [
					"obsługa zapytań i kontakt przed zawarciem umowy: art. 6 ust. 1 lit. b RODO,",
					"obsługa i archiwizacja korespondencji oraz obrona roszczeń: art. 6 ust. 1 lit. f RODO (uzasadniony interes),",
					"zapewnienie bezpieczeństwa formularza i ograniczanie spamu: art. 6 ust. 1 lit. f RODO.",
				],
			},
			{
				title: "4. Odbiorcy danych",
				paragraphs: ["Dane mogą być przekazywane podmiotom wspierającym działanie serwisu:"],
				points: [
					"Cloudflare, Inc. (hosting, bezpieczeństwo i infrastruktura),",
					"Resend, Inc. (obsługa wysyłki wiadomości e-mail z formularza kontaktowego).",
				],
			},
			{
				title: "5. Transfer danych poza EOG",
				paragraphs: [
					"W związku z korzystaniem z usług globalnych dostawców (Cloudflare, Resend) dane mogą być przekazywane poza Europejski Obszar Gospodarczy.",
					"W takim przypadku transfer odbywa się z zastosowaniem odpowiednich zabezpieczeń prawnych, np. standardowych klauzul umownych (SCC).",
				],
			},
			{
				title: "6. Okres przechowywania",
				points: [
					"dane z formularza kontaktowego: do czasu zakończenia korespondencji i przez okres niezbędny do zabezpieczenia roszczeń,",
					"dane techniczne i bezpieczeństwa: przez okres niezbędny do zapewnienia bezpieczeństwa serwisu i wykrywania nadużyć.",
				],
			},
			{
				title: "7. Twoje prawa",
				points: [
					"prawo dostępu do danych,",
					"prawo sprostowania danych,",
					"prawo usunięcia danych,",
					"prawo ograniczenia przetwarzania,",
					"prawo wniesienia sprzeciwu,",
					"prawo wniesienia skargi do Prezesa UODO.",
				],
			},
			{
				title: "8. Pliki cookie i podobne technologie",
				paragraphs: ["Serwis używa wyłącznie technologii niezbędnych i preferencyjnych:"],
				points: [
					"niezbędne: zapis decyzji o cookies (aby zapamiętać wybór użytkownika),",
					"preferencyjne (opcjonalne): zapamiętanie wybranego motywu i języka strony.",
					"nie używam analitycznych plików cookies.",
					"nie używam cookies marketingowych ani narzędzi reklamowych.",
				],
			},
			{
				title: "9. Dobrowolność podania danych",
				paragraphs: [
					"Podanie danych w formularzu jest dobrowolne, ale niezbędne do obsługi zapytania.",
					"Brak podania danych może uniemożliwić odpowiedź na wiadomość.",
				],
			},
			{
				title: "10. Zmiany polityki",
				paragraphs: [
					"Polityka może być aktualizowana wraz ze zmianami technologicznymi lub prawnymi.",
					"Nowa wersja obowiązuje od daty publikacji na tej stronie.",
				],
			},
		],
	},
	en: {
		eyebrow: "Legal document",
		title: "Privacy Policy",
		updatedAt: "Last updated: February 21, 2026.",
		back: "Back to homepage",
		notice:
			"Before publishing, complete controller details: full name (or business name), contact address and a privacy contact channel (form and/or email).",
		sections: [
			{
				title: "1. Data controller",
				paragraphs: [
					"The data controller is Jakub Reszka, operating this personal portfolio website.",
					"Privacy contact: contact form available in the Contact section on the homepage.",
				],
			},
			{
				title: "2. What data is processed",
				paragraphs: ["When you use the contact form, I may process:"],
				points: [
					"full name,",
					"email address,",
					"phone number,",
					"contact purpose and message content,",
					"technical security data (e.g., IP address, request identifier, submission timing).",
				],
			},
			{
				title: "3. Purposes and legal bases",
				points: [
					"handling inquiries and pre-contract communication: GDPR Art. 6(1)(b),",
					"communication records and legal claims defense: GDPR Art. 6(1)(f) (legitimate interest),",
					"contact form security and anti-spam protection: GDPR Art. 6(1)(f).",
				],
			},
			{
				title: "4. Data recipients",
				paragraphs: ["Data may be shared with service providers supporting website operations:"],
				points: [
					"Cloudflare, Inc. (hosting, security and infrastructure),",
					"Resend, Inc. (email delivery for contact form messages).",
				],
			},
			{
				title: "5. Transfers outside the EEA",
				paragraphs: [
					"As global providers are used (Cloudflare and Resend), data may be transferred outside the European Economic Area.",
					"Where applicable, such transfers rely on legal safeguards, including Standard Contractual Clauses (SCC).",
				],
			},
			{
				title: "6. Retention period",
				points: [
					"contact form data: until communication is complete and for the period needed to secure legal claims,",
					"security and technical data: for as long as required to protect the service and prevent abuse.",
				],
			},
			{
				title: "7. Your rights",
				points: [
					"right of access,",
					"right to rectification,",
					"right to erasure,",
					"right to restriction,",
					"right to object,",
					"right to lodge a complaint with a supervisory authority.",
				],
			},
			{
				title: "8. Cookies and similar technologies",
				paragraphs: ["The website uses only essential and preference technologies:"],
				points: [
					"essential: storing your cookie preference decision,",
					"optional preferences: storing selected theme and language.",
					"no analytics cookies are used.",
					"no marketing cookies or ad trackers are used.",
				],
			},
			{
				title: "9. Voluntary data provision",
				paragraphs: [
					"Providing form data is voluntary but necessary to receive a response.",
					"If data is not provided, handling the inquiry may not be possible.",
				],
			},
			{
				title: "10. Policy updates",
				paragraphs: [
					"This policy may be updated due to legal or technical changes.",
					"The updated version applies from the publication date shown on this page.",
				],
			},
		],
	},
};

export default function PrivacyPolicyPage() {
	const { language } = useLanguage();
	const copy = policyContentByLanguage[language];

	return (
		<main className="legal-page">
			<a href="/" className="brand-wordmark" aria-label={copy.back}>
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>
			<TopControls />

			<div className="legal-page-inner">
				<Link href="/" className="legal-back-link">
					{copy.back}
				</Link>

				<header className="legal-page-header">
					<p className="legal-page-eyebrow">{copy.eyebrow}</p>
					<h1 className="legal-page-title">{copy.title}</h1>
					<p className="legal-page-updated">{copy.updatedAt}</p>
				</header>

				<div className="legal-page-alert">{copy.notice}</div>

				<div className="legal-sections">
					{copy.sections.map((section) => (
						<section key={section.title} className="legal-section">
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
