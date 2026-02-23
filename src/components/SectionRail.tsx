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
		if (sectionIds.length === 0) {
			return;
		}

		let frameId: number | null = null;

		const syncActiveSection = () => {
			const sectionElements = sectionIds
				.map((id) => document.getElementById(id))
				.filter((section): section is HTMLElement => section !== null);

			if (sectionElements.length === 0) {
				return;
			}

			const viewportAnchor = window.innerHeight * 0.45;
			const containingSection = sectionElements.find((section) => {
				const rect = section.getBoundingClientRect();
				return rect.top <= viewportAnchor && rect.bottom >= viewportAnchor;
			});

			if (containingSection) {
				setActiveId(containingSection.id);
				return;
			}

			const nearestSection = sectionElements.reduce((closest, section) => {
				const rect = section.getBoundingClientRect();
				const sectionCenter = rect.top + rect.height / 2;
				const distance = Math.abs(sectionCenter - viewportAnchor);
				return distance < closest.distance ? { id: section.id, distance } : closest;
			}, { id: sectionElements[0].id, distance: Number.POSITIVE_INFINITY });

			setActiveId(nearestSection.id);
		};

		const scheduleSync = () => {
			if (frameId !== null) {
				return;
			}
			frameId = window.requestAnimationFrame(() => {
				frameId = null;
				syncActiveSection();
			});
		};

		syncActiveSection();

		const mutationObserver = new MutationObserver(() => {
			scheduleSync();
		});
		mutationObserver.observe(document.body, { childList: true, subtree: true });
		window.addEventListener("scroll", scheduleSync, { passive: true });
		window.addEventListener("resize", scheduleSync);
		window.addEventListener("hashchange", scheduleSync);

		return () => {
			if (frameId !== null) {
				window.cancelAnimationFrame(frameId);
			}
			window.removeEventListener("scroll", scheduleSync);
			window.removeEventListener("resize", scheduleSync);
			window.removeEventListener("hashchange", scheduleSync);
			mutationObserver.disconnect();
		};
	}, [sectionIds]);

	if (sections.length === 0) {
		return null;
	}

	return (
		<>
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

			<nav className="section-dock" aria-label={language === "pl" ? "Nawigacja mobilna" : "Mobile navigation"}>
				<ul className="section-dock-list">
					{sections.map((section) => {
						const isActive = section.id === activeId;
						return (
							<li key={`dock-${section.id}`} className="section-dock-item">
								<a href={`#${section.id}`} className={`section-dock-link ${isActive ? "is-active" : ""}`}>
									{section.label}
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}
