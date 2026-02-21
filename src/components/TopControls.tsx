"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

const languages = [
	{ code: "PL", label: "Polski" },
	{ code: "EN", label: "English" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

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
	const [isDarkPreview, setIsDarkPreview] = useState(false);
	const [activeLanguage, setActiveLanguage] = useState<LanguageCode>("PL");
	const [isLanguageOpen, setIsLanguageOpen] = useState(false);
	const languageRef = useRef<HTMLDivElement | null>(null);

	const closeLanguageMenu = useCallback(() => {
		setIsLanguageOpen(false);
	}, []);

	useEffect(() => {
		document.documentElement.dataset.themePreview = isDarkPreview ? "dark" : "light";
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

	const handleLanguageSelect = useCallback((code: LanguageCode) => {
		setActiveLanguage(code);
		setIsLanguageOpen(false);
	}, []);

	return (
		<div className="top-controls" aria-label="Ustawienia strony">
			<button
				type="button"
				className={`theme-switch ${isDarkPreview ? "is-dark" : ""}`}
				onClick={toggleThemePreview}
				aria-pressed={isDarkPreview}
				aria-label={isDarkPreview ? "Przelacz na jasny motyw" : "Przelacz na ciemny motyw"}
				title={isDarkPreview ? "Jasny motyw" : "Ciemny motyw"}
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
					aria-label="Wybierz jezyk"
					title="Wybierz jezyk"
				>
					<Globe className="language-globe-icon" aria-hidden="true" />
					<span className="language-code" aria-hidden="true">
						{activeLanguage}
					</span>
				</button>

				<div className={`language-menu ${isLanguageOpen ? "is-open" : ""}`} role="menu" aria-label="Wybierz jezyk">
					{languages.map((language) => {
						const isActive = language.code === activeLanguage;
						return (
							<button
								key={language.code}
								type="button"
								role="menuitemradio"
								aria-checked={isActive}
								className={`language-option ${isActive ? "is-active" : ""}`}
								onClick={() => handleLanguageSelect(language.code)}
							>
								<span>{language.label}</span>
								<span className="language-option-code">{language.code}</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
