"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import { CONSENT_EVENT, THEME_STORAGE_KEY, hasFunctionalConsent } from "@/lib/consent";

const languages = [
	{ code: "pl", label: "Polski" },
	{ code: "en", label: "English" },
] as const;

function mapPathToLanguagePath(pathname: string, language: AppLanguage): string | null {
	const isEnglishPath = pathname === "/en" || pathname.startsWith("/en/");
	const basePath = isEnglishPath
		? pathname.replace(/^\/en(?=\/|$)/, "") || "/"
		: pathname;

	const hasLocalizedRoute =
		basePath === "/" ||
		basePath === "/blog" ||
		basePath.startsWith("/blog/") ||
		basePath === "/polityka-prywatnosci" ||
		basePath === "/regulamin";
	if (!hasLocalizedRoute) {
		return null;
	}

	if (language === "en") {
		return basePath === "/" ? "/en" : `/en${basePath}`;
	}

	return basePath;
}

type IconProps = {
	className?: string;
};

function SunIcon({ className = "" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
			<path
				d="M12 2.6v2.3M12 19.1v2.3M21.4 12h-2.3M4.9 12H2.6M18.65 5.35l-1.6 1.6M6.95 17.05l-1.6 1.6M18.65 18.65l-1.6-1.6M6.95 6.95l-1.6-1.6"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function MoonIcon({ className = "" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
			<path
				d="M20.2 14.2A8.7 8.7 0 1 1 9.8 3.8a7 7 0 1 0 10.4 10.4Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function TopControls() {
	const pathname = usePathname();
	const router = useRouter();
	const { language, setLanguage } = useLanguage();
	const [isDarkPreview, setIsDarkPreview] = useState(false);
	const [isLanguageOpen, setIsLanguageOpen] = useState(false);
	const languageRef = useRef<HTMLDivElement | null>(null);

	const closeLanguageMenu = useCallback(() => {
		setIsLanguageOpen(false);
	}, []);

	useEffect(() => {
		const persistedTheme = hasFunctionalConsent() ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
		if (persistedTheme === "dark" || persistedTheme === "light") {
			setIsDarkPreview(persistedTheme === "dark");
			return;
		}

		const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setIsDarkPreview(prefersDarkTheme);
	}, []);

	useEffect(() => {
		const theme = isDarkPreview ? "dark" : "light";
		document.documentElement.dataset.themePreview = theme;
		document.documentElement.style.colorScheme = theme;
		if (hasFunctionalConsent()) {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
			return;
		}
		window.localStorage.removeItem(THEME_STORAGE_KEY);
	}, [isDarkPreview]);

	useEffect(() => {
		const syncThemeStorage = () => {
			const theme = isDarkPreview ? "dark" : "light";
			if (hasFunctionalConsent()) {
				window.localStorage.setItem(THEME_STORAGE_KEY, theme);
				return;
			}
			window.localStorage.removeItem(THEME_STORAGE_KEY);
		};

		window.addEventListener(CONSENT_EVENT, syncThemeStorage as EventListener);
		return () => window.removeEventListener(CONSENT_EVENT, syncThemeStorage as EventListener);
	}, [isDarkPreview]);

	useEffect(() => {
		if (!isLanguageOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (!languageRef.current?.contains(event.target as Node)) {
				closeLanguageMenu();
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeLanguageMenu();
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [closeLanguageMenu, isLanguageOpen]);

	const toggleThemePreview = useCallback(() => {
		setIsDarkPreview((current) => !current);
	}, []);

	const toggleLanguageMenu = useCallback(() => {
		setIsLanguageOpen((current) => !current);
	}, []);

	const handleLanguageSelect = useCallback((code: AppLanguage) => {
		const nextPathname = mapPathToLanguagePath(pathname, code);

		setLanguage(code);
		setIsLanguageOpen(false);
		if (nextPathname && nextPathname !== pathname) {
			router.push(nextPathname, { scroll: false });
		}
	}, [pathname, router, setLanguage]);

	const labels =
		language === "pl"
			? {
					theme: isDarkPreview ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw",
					themeTitle: isDarkPreview ? "Jasny motyw" : "Ciemny motyw",
					language: "Wybierz język",
			  }
			: {
					theme: isDarkPreview ? "Switch to light theme" : "Switch to dark theme",
					themeTitle: isDarkPreview ? "Light theme" : "Dark theme",
					language: "Select language",
			  };

	return (
		<div className="top-controls" aria-label={language === "pl" ? "Ustawienia strony" : "Website settings"}>
			<button
				type="button"
				className={`theme-switch ${isDarkPreview ? "is-dark" : ""}`}
				onClick={toggleThemePreview}
				aria-pressed={isDarkPreview}
				aria-label={labels.theme}
				title={labels.themeTitle}
			>
				<span className="theme-switch-track" aria-hidden="true">
					<SunIcon className="theme-track-icon theme-track-icon-sun" />
					<MoonIcon className="theme-track-icon theme-track-icon-moon" />
				</span>
				<span className="theme-switch-thumb" aria-hidden="true">
					<span className="theme-switch-thumb-inner">
						<SunIcon className="theme-thumb-icon theme-thumb-icon-sun" />
						<MoonIcon className="theme-thumb-icon theme-thumb-icon-moon" />
					</span>
				</span>
			</button>

			<div className={`language-picker ${isLanguageOpen ? "is-open" : ""}`} ref={languageRef}>
				<button
					type="button"
					className="top-icon-button language-toggle"
					onClick={toggleLanguageMenu}
					aria-haspopup="menu"
					aria-expanded={isLanguageOpen}
					aria-label={labels.language}
					title={labels.language}
				>
					<Globe className="language-globe-icon" aria-hidden="true" />
					<span className="language-code" aria-hidden="true">
						{language.toUpperCase()}
					</span>
				</button>

				<div className={`language-menu ${isLanguageOpen ? "is-open" : ""}`} role="menu" aria-label={labels.language}>
					{languages.map((option) => {
						const isActive = option.code === language;
						return (
							<button
								key={option.code}
								type="button"
								role="menuitemradio"
								aria-checked={isActive}
								className={`language-option ${isActive ? "is-active" : ""}`}
								onClick={() => handleLanguageSelect(option.code)}
							>
								<span>{option.label}</span>
								<span className="language-option-code">{option.code.toUpperCase()}</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
