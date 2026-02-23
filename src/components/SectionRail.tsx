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
		let observer: IntersectionObserver | null = null;
		let observedElements = new Map<string, HTMLElement>();

		const handleIntersections: IntersectionObserverCallback = (entries) => {
			const visibleEntries = entries.filter((entry) => entry.isIntersecting);
			if (visibleEntries.length === 0) {
				return;
			}

			const mostVisibleEntry = visibleEntries.reduce((bestEntry, currentEntry) =>
				currentEntry.intersectionRatio > bestEntry.intersectionRatio ? currentEntry : bestEntry
			);

			setActiveId(mostVisibleEntry.target.id);
		};

		const connectObserver = () => {
			const currentElements = new Map<string, HTMLElement>();
			sectionIds.forEach((id) => {
				const element = document.getElementById(id);
				if (element) {
					currentElements.set(id, element);
				}
			});

			const hasChanged =
				currentElements.size !== observedElements.size ||
				Array.from(currentElements.entries()).some(([id, element]) => observedElements.get(id) !== element);

			if (!hasChanged) {
				return;
			}

			observer?.disconnect();
			observer = null;
			observedElements = currentElements;

			if (observedElements.size === 0) {
				return;
			}

			observer = new IntersectionObserver(handleIntersections, {
				threshold: [0.2, 0.35, 0.5, 0.7],
				rootMargin: "-28% 0px -28% 0px",
			});

			observedElements.forEach((element) => observer?.observe(element));
		};

		const scheduleReconnect = () => {
			if (frameId !== null) {
				return;
			}
			frameId = window.requestAnimationFrame(() => {
				frameId = null;
				connectObserver();
			});
		};

		connectObserver();

		const mutationObserver = new MutationObserver(() => {
			scheduleReconnect();
		});
		mutationObserver.observe(document.body, { childList: true, subtree: true });
		window.addEventListener("resize", scheduleReconnect);

		return () => {
			if (frameId !== null) {
				window.cancelAnimationFrame(frameId);
			}
			window.removeEventListener("resize", scheduleReconnect);
			mutationObserver.disconnect();
			observer?.disconnect();
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
