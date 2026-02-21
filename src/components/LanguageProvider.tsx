"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "pl" | "en";

const LANGUAGE_STORAGE_KEY = "portfolio-language";

type LanguageContextValue = {
	language: AppLanguage;
	setLanguage: (language: AppLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isKnownLanguage = (value: string | null): value is AppLanguage => value === "pl" || value === "en";

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
}: {
	children: React.ReactNode;
	initialLanguage?: AppLanguage;
}) {
	const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

	useEffect(() => {
		const persisted = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (isKnownLanguage(persisted)) {
			setLanguageState(persisted);
			return;
		}

		setLanguageState(initialLanguage || detectPreferredLanguage());
	}, [initialLanguage]);

	useEffect(() => {
		document.documentElement.lang = language;
		document.documentElement.dataset.language = language;
		window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
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
