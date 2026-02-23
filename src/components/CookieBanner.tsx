"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
	CONSENT_EVENT,
	type ConsentLevel,
	getStoredConsent,
	setStoredConsent,
} from "@/lib/consent";

export default function CookieBanner() {
	const { language } = useLanguage();
	const [consent, setConsent] = useState<ConsentLevel | null>(null);

	useEffect(() => {
		const syncConsent = () => {
			setConsent(getStoredConsent());
		};

		syncConsent();
		window.addEventListener(CONSENT_EVENT, syncConsent as EventListener);

		return () => window.removeEventListener(CONSENT_EVENT, syncConsent as EventListener);
	}, []);

	const copy = useMemo(
		() =>
			language === "pl"
				? {
						title: "Pliki cookie",
						description:
							"Używam wyłącznie niezbędnych plików cookie i podobnych technologii. Opcjonalnie możesz włączyć zapis preferencji (motyw i język).",
						necessary: "Tylko niezbędne",
						functional: "Akceptuj preferencje",
						policy: "Polityka prywatności",
						terms: "Regulamin",
						policyHref: "/polityka-prywatnosci",
						termsHref: "/regulamin",
				  }
				: {
						title: "Cookies",
						description:
							"I use only essential cookies and similar technologies. Optionally, you can allow preference storage (theme and language).",
						necessary: "Essential only",
						functional: "Accept preferences",
						policy: "Privacy policy",
						terms: "Terms",
						policyHref: "/en/polityka-prywatnosci",
						termsHref: "/en/regulamin",
				  },
		[language]
	);

	if (consent) {
		return null;
	}

	return (
		<div className="cookie-banner" role="dialog" aria-live="polite" aria-label={copy.title}>
			<div className="cookie-banner-inner">
				<div className="cookie-banner-copy">
					<p className="cookie-banner-title">{copy.title}</p>
					<p className="cookie-banner-text">
						{copy.description} <Link href={copy.policyHref}>{copy.policy}</Link> ·{" "}
						<Link href={copy.termsHref}>{copy.terms}</Link>
					</p>
				</div>
				<div className="cookie-banner-actions">
					<button
						type="button"
						className="cookie-btn cookie-btn-secondary"
						onClick={() => setStoredConsent("necessary")}
					>
						{copy.necessary}
					</button>
					<button
						type="button"
						className="cookie-btn cookie-btn-primary"
						onClick={() => setStoredConsent("functional")}
					>
						{copy.functional}
					</button>
				</div>
			</div>
		</div>
	);
}
