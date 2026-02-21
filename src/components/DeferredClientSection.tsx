"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type DeferredModule = {
	default: ComponentType;
};

type DeferredClientSectionProps = {
	sectionId: string;
	loader: () => Promise<DeferredModule>;
	fallbackEyebrow: string;
	fallbackTitle?: string;
	rootMargin?: string;
	minHeight?: number;
};

export default function DeferredClientSection({
	sectionId,
	loader,
	fallbackEyebrow,
	fallbackTitle,
	rootMargin = "450px 0px",
	minHeight = 680,
}: DeferredClientSectionProps) {
	const [shouldLoad, setShouldLoad] = useState(false);
	const [LoadedSection, setLoadedSection] = useState<ComponentType | null>(null);
	const placeholderRef = useRef<HTMLElement | null>(null);

	const maybeLoadFromHash = useCallback(() => {
		if (window.location.hash === `#${sectionId}`) {
			setShouldLoad(true);
		}
	}, [sectionId]);

	useEffect(() => {
		maybeLoadFromHash();
		window.addEventListener("hashchange", maybeLoadFromHash);
		return () => window.removeEventListener("hashchange", maybeLoadFromHash);
	}, [maybeLoadFromHash]);

	useEffect(() => {
		if (shouldLoad || LoadedSection) {
			return;
		}

		const target = placeholderRef.current;
		if (!target) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin }
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, [LoadedSection, rootMargin, shouldLoad]);

	useEffect(() => {
		if (!shouldLoad || LoadedSection) {
			return;
		}

		let cancelled = false;
		loader().then((module) => {
			if (cancelled) {
				return;
			}
			setLoadedSection(() => module.default);
		});

		return () => {
			cancelled = true;
		};
	}, [LoadedSection, loader, shouldLoad]);

	if (LoadedSection) {
		return <LoadedSection />;
	}

	return (
		<section
			id={sectionId}
			ref={placeholderRef}
			className="page-section deferred-section-placeholder"
			style={{ minHeight: `${minHeight}px` }}
			aria-busy="true"
		>
			<div className="page-section-inner deferred-section-inner">
				<p className="page-section-eyebrow">{fallbackEyebrow}</p>
				{fallbackTitle ? <h2 className="page-section-title">{fallbackTitle}</h2> : null}
				<div className="deferred-section-skeleton" />
			</div>
		</section>
	);
}
