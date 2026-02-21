export type ConsentLevel = "necessary" | "functional";

export const CONSENT_STORAGE_KEY = "portfolio-consent";
export const CONSENT_EVENT = "portfolio:consent-changed";
export const THEME_STORAGE_KEY = "portfolio-theme";
export const LANGUAGE_STORAGE_KEY = "portfolio-language";

const isConsentLevel = (value: string | null): value is ConsentLevel =>
	value === "necessary" || value === "functional";

export const getStoredConsent = (): ConsentLevel | null => {
	if (typeof window === "undefined") {
		return null;
	}

	const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
	return isConsentLevel(stored) ? stored : null;
};

export const hasFunctionalConsent = (): boolean => getStoredConsent() === "functional";

export const setStoredConsent = (level: ConsentLevel) => {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(CONSENT_STORAGE_KEY, level);
	if (level !== "functional") {
		window.localStorage.removeItem(THEME_STORAGE_KEY);
		window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
	}

	window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { level } }));
};

export const clearStoredConsent = () => {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(CONSENT_STORAGE_KEY);
	window.localStorage.removeItem(THEME_STORAGE_KEY);
	window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
	window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
};
