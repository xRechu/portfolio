"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type SectionItem = {
	id: string;
	label: string;
};

type SectionRailProps = {
	sections: SectionItem[];
};

const MOBILE_BREAKPOINT = 1024;

export default function SectionRail({ sections }: SectionRailProps) {
	const { language } = useLanguage();
	const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
	const [isVisible, setIsVisible] = useState(false);
	const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

	useEffect(() => {
		if (sectionIds.length === 0) {
			return;
		}

		const handleRailVisibility = () => {
			if (window.innerWidth < MOBILE_BREAKPOINT) {
				setIsVisible(false);
				return;
			}

			const heroSection = document.getElementById(sectionIds[0]);
			if (!heroSection) {
				return;
			}

			const heroBottom = heroSection.getBoundingClientRect().bottom;
			setIsVisible(heroBottom <= window.innerHeight * 0.35);
		};

		handleRailVisibility();
		window.addEventListener("scroll", handleRailVisibility, { passive: true });
		window.addEventListener("resize", handleRailVisibility);

		return () => {
			window.removeEventListener("scroll", handleRailVisibility);
			window.removeEventListener("resize", handleRailVisibility);
		};
	}, [sectionIds]);

	useEffect(() => {
		const sectionElements = sectionIds
			.map((id) => document.getElementById(id))
			.filter((section): section is HTMLElement => section !== null);

		if (sectionElements.length === 0) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntries = entries.filter((entry) => entry.isIntersecting);
				if (visibleEntries.length === 0) {
					return;
				}

				const mostVisibleEntry = visibleEntries.reduce((bestEntry, currentEntry) =>
					currentEntry.intersectionRatio > bestEntry.intersectionRatio ? currentEntry : bestEntry
				);

				setActiveId(mostVisibleEntry.target.id);
			},
			{
				threshold: [0.2, 0.35, 0.5, 0.7],
				rootMargin: "-28% 0px -28% 0px",
			}
		);

		sectionElements.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, [sectionIds]);

	if (sections.length === 0) {
		return null;
	}

	return (
		<nav
			className={`section-rail ${isVisible ? "section-rail-visible" : ""}`}
			aria-label={language === "pl" ? "Nawigacja sekcji" : "Section navigation"}
		>
			<div className="section-rail-track" />
			<ul className="section-rail-list">
				{sections.map((section) => {
					const isActive = section.id === activeId;

					return (
						<li key={section.id} className="section-rail-item">
							<a
								href={`#${section.id}`}
								className={`section-rail-link ${isActive ? "is-active" : ""}`}
								aria-label={section.label}
							>
								<span className="section-rail-dot" />
								<span className="section-rail-label">{section.label}</span>
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
