"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const languages = [
	{ code: "PL", label: "Polski" },
	{ code: "EN", label: "English" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

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
				className={`top-icon-button theme-toggle ${isDarkPreview ? "is-dark" : ""}`}
				onClick={toggleThemePreview}
				aria-pressed={isDarkPreview}
				aria-label={isDarkPreview ? "Przelacz na jasny motyw" : "Przelacz na ciemny motyw"}
				title={isDarkPreview ? "Jasny motyw" : "Ciemny motyw"}
			>
				<span className="theme-icon" aria-hidden="true">
					<span className="theme-sun" />
					<span className="theme-moon" />
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
					<span className="language-globe" aria-hidden="true" />
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
