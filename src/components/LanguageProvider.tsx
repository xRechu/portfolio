"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, LANGUAGE_STORAGE_KEY, hasFunctionalConsent } from "@/lib/consent";

export type AppLanguage = "pl" | "en";

type LanguageContextValue = {
	language: AppLanguage;
	setLanguage: (language: AppLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isKnownLanguage = (value: string | null): value is AppLanguage => value === "pl" || value === "en";

const resolveLanguageFromPathname = (pathname: string | null): AppLanguage | null => {
	if (!pathname) {
		return null;
	}

	if (pathname === "/en" || pathname.startsWith("/en/")) {
		return "en";
	}

	if (pathname.startsWith("/")) {
		return "pl";
	}

	return null;
};

const detectPreferredLanguage = (): AppLanguage => {
	if (typeof window === "undefined") {
		return "en";
	}

	const browserLocales = [navigator.language, ...(navigator.languages ?? [])]
		.filter((locale): locale is string => Boolean(locale))
		.map((locale) => locale.toLowerCase());

	const usesPolishLocale = browserLocales.some((locale) => locale === "pl" || locale.startsWith("pl-"));
	const hasPolandRegion = browserLocales.some((locale) => locale.endsWith("-pl"));

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() ?? "";
	const isPolandTimezone = timezone === "europe/warsaw";

	return usesPolishLocale || hasPolandRegion || isPolandTimezone ? "pl" : "en";
};

export function LanguageProvider({
	children,
	initialLanguage = "en",
	usePersistedLanguage = true,
}: {
	children: React.ReactNode;
	initialLanguage?: AppLanguage;
	usePersistedLanguage?: boolean;
}) {
	const pathname = usePathname();
	const routeLanguage = resolveLanguageFromPathname(pathname);
	const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

	useEffect(() => {
		if (routeLanguage) {
			setLanguageState(routeLanguage);
			return;
		}

		if (usePersistedLanguage && hasFunctionalConsent()) {
			const persisted = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
			if (isKnownLanguage(persisted)) {
				setLanguageState(persisted);
				return;
			}
		}

		setLanguageState(initialLanguage || detectPreferredLanguage());
	}, [initialLanguage, routeLanguage, usePersistedLanguage]);

	useEffect(() => {
		document.documentElement.lang = language;
		document.documentElement.dataset.language = language;
		if (hasFunctionalConsent()) {
			window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
			return;
		}
		window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
	}, [language]);

	useEffect(() => {
		const syncLanguageStorage = () => {
			if (hasFunctionalConsent()) {
				window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
				return;
			}
			window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
		};

		window.addEventListener(CONSENT_EVENT, syncLanguageStorage as EventListener);
		return () => window.removeEventListener(CONSENT_EVENT, syncLanguageStorage as EventListener);
	}, [language]);

	const setLanguage = useCallback((nextLanguage: AppLanguage) => {
		setLanguageState(nextLanguage);
	}, []);

	const contextValue = useMemo(
		() => ({
			language,
			setLanguage,
		}),
		[language, setLanguage]
	);

	return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within LanguageProvider");
	}

	return context;
}
