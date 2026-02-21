"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CardSwap from "@/components/CardSwap";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import styles from "./RealizationsSection.module.css";

type ProjectTone = "ocean" | "graphite" | "mint" | "sand";

type Project = {
	id: string;
	name: string;
	stack: string;
	url: string;
	short: string;
	description: string;
	features: string[];
	tone: ProjectTone;
	previewLabel: string;
	previewImage: string | null;
};

type SwapControls = {
	next: () => void;
	prev: () => void;
};

const projectsByLanguage: Record<AppLanguage, Project[]> = {
	pl: [
		{
			id: "wellness-studio",
			name: "Wellness Studio",
			stack: "Next.js + Headless CMS",
			url: "https://example.com",
			short: "Szybka strona usługowa z naciskiem na SEO i konwersję.",
			description:
				"Projekt skupiony na lead generation. Strona ma lekki frontend, szybki TTFB i modularny edytor treści dla klienta.",
			features: [
				"Autorski system sekcji landing page z łatwą edycją treści",
				"Optymalizacja Core Web Vitals pod kampanie płatne i SEO",
				"Integracja formularzy z automatycznym routingiem leadów",
			],
			tone: "ocean",
			previewLabel: "Landing Page",
			previewImage: null,
		},
		{
			id: "fashion-store",
			name: "Fashion Commerce",
			stack: "Medusa.js + Next.js",
			url: "https://example.com",
			short: "Sklep e-commerce z custom checkout i automatyzacjami.",
			description:
				"Sklep budowany pod skalowanie. Backend Medusa obsługuje niestandardowe promocje i scenariusze koszyka.",
			features: [
				"Autorskie reguły rabatowe i bundle products",
				"Szybki storefront oparty o SSR + cache strategia",
				"Integracje płatności i panelu logistycznego",
			],
			tone: "graphite",
			previewLabel: "Storefront",
			previewImage: null,
		},
		{
			id: "academy-pro",
			name: "Academy Platform",
			stack: "Next.js + Supabase",
			url: "https://example.com",
			short: "Platforma contentowa z kontami i strefą premium.",
			description:
				"Rozwiązanie dla biznesu edukacyjnego. Obejmuje role userów, dostęp warunkowy i skalowalną strukturę treści.",
			features: [
				"Strefa klienta z podziałem uprawnień i subskrypcji",
				"Panel zarządzania materiałami i postępem nauki",
				"Automatyczne scenariusze onboarding + e-mail follow-up",
			],
			tone: "mint",
			previewLabel: "Web App",
			previewImage: null,
		},
		{
			id: "furniture-brand",
			name: "Furniture Brand",
			stack: "WooCommerce + Next.js",
			url: "https://example.com",
			short: "Hybrid commerce z naciskiem na UX katalogu i mobile.",
			description:
				"Wdrożenie dla marki meblowej. Kluczowe były szybkie listingi produktów i wygodne filtry na urządzeniach mobilnych.",
			features: [
				"Custom warstwa frontend na WooCommerce API",
				"Autorski konfigurator wariantów i zestawów",
				"Integracja feedów marketingowych i analityki",
			],
			tone: "sand",
			previewLabel: "Product Catalog",
			previewImage: null,
		},
	],
	en: [
		{
			id: "wellness-studio",
			name: "Wellness Studio",
			stack: "Next.js + Headless CMS",
			url: "https://example.com",
			short: "Fast business website focused on SEO and conversion.",
			description:
				"Lead-generation focused build with lightweight frontend, low TTFB and modular content editing.",
			features: [
				"Custom landing section system with easy editing",
				"Core Web Vitals optimization for paid campaigns and SEO",
				"Form integrations with automatic lead routing",
			],
			tone: "ocean",
			previewLabel: "Landing Page",
			previewImage: null,
		},
		{
			id: "fashion-store",
			name: "Fashion Commerce",
			stack: "Medusa.js + Next.js",
			url: "https://example.com",
			short: "E-commerce store with custom checkout and automations.",
			description:
				"Built for scale. Medusa backend handles custom promotion logic and non-standard cart scenarios.",
			features: [
				"Custom discount logic and bundled products",
				"Fast storefront powered by SSR and cache strategy",
				"Payment and logistics dashboard integrations",
			],
			tone: "graphite",
			previewLabel: "Storefront",
			previewImage: null,
		},
		{
			id: "academy-pro",
			name: "Academy Platform",
			stack: "Next.js + Supabase",
			url: "https://example.com",
			short: "Content platform with accounts and premium access.",
			description:
				"Education-oriented platform with roles, gated access and scalable content structure.",
			features: [
				"Client zone with role-based access and subscriptions",
				"Content and progress management dashboard",
				"Automated onboarding and email follow-up flows",
			],
			tone: "mint",
			previewLabel: "Web App",
			previewImage: null,
		},
		{
			id: "furniture-brand",
			name: "Furniture Brand",
			stack: "WooCommerce + Next.js",
			url: "https://example.com",
			short: "Hybrid commerce focused on catalog UX and mobile performance.",
			description:
				"Implementation for a furniture brand with priority on fast listings and smooth mobile filtering.",
			features: [
				"Custom frontend layer on WooCommerce API",
				"Custom product variant and bundle configurator",
				"Marketing feeds and analytics integrations",
			],
			tone: "sand",
			previewLabel: "Product Catalog",
			previewImage: null,
		},
	],
};

const uiCopyByLanguage: Record<
	AppLanguage,
	{
		eyebrow: string;
		cardAriaPrefix: string;
		previewPlaceholder: string;
		learnMore: string;
		openSite: string;
		controlsLabel: string;
		prevAria: string;
		nextAria: string;
		detailsEyebrow: string;
		stackLabel: string;
	}
> = {
	pl: {
		eyebrow: "Realizacje",
		cardAriaPrefix: "Projekt",
		previewPlaceholder: "Podmień na screenshot hero",
		learnMore: "Dowiedz się więcej",
		openSite: "Otwórz stronę",
		controlsLabel: "Sterowanie realizacjami",
		prevAria: "Poprzednia realizacja",
		nextAria: "Następna realizacja",
		detailsEyebrow: "Szczegóły projektu",
		stackLabel: "Stack:",
	},
	en: {
		eyebrow: "Projects",
		cardAriaPrefix: "Project",
		previewPlaceholder: "Replace with hero screenshot",
		learnMore: "Learn more",
		openSite: "Open website",
		controlsLabel: "Projects navigation",
		prevAria: "Previous project",
		nextAria: "Next project",
		detailsEyebrow: "Project details",
		stackLabel: "Stack:",
	},
};

export default function RealizationsSection() {
	const { language } = useLanguage();
	const projects = projectsByLanguage[language];
	const ui = uiCopyByLanguage[language];

	const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? "");
	const [controls, setControls] = useState<SwapControls | null>(null);
	const [viewportWidth, setViewportWidth] = useState(1280);

	useEffect(() => {
		setActiveProjectId((current) =>
			projects.some((project) => project.id === current) ? current : (projects[0]?.id ?? "")
		);
	}, [projects]);

	useEffect(() => {
		const syncViewportWidth = () => setViewportWidth(window.innerWidth);
		syncViewportWidth();
		window.addEventListener("resize", syncViewportWidth);
		return () => window.removeEventListener("resize", syncViewportWidth);
	}, []);

	const handleSwapReady = useCallback((api?: SwapControls) => {
		if (!api) {
			return;
		}
		setControls((current) => current ?? api);
	}, []);

	const handleFrontCardChange = useCallback(
		(cardIndex: number) => {
			const project = projects[cardIndex];
			if (!project) {
				return;
			}
			setActiveProjectId(project.id);
		},
		[projects]
	);

	const activeProject = useMemo(
		() => projects.find((project) => project.id === activeProjectId) ?? projects[0],
		[activeProjectId, projects]
	);

	const cardLayout = useMemo(() => {
		if (viewportWidth < 720) {
			return {
				width: Math.max(262, Math.min(322, viewportWidth - 52)),
				height: 246,
				cardDistance: 22,
				verticalDistance: 18,
			};
		}

		if (viewportWidth < 1024) {
			return {
				width: 360,
				height: 255,
				cardDistance: 28,
				verticalDistance: 22,
			};
		}

		return {
			width: 410,
			height: 280,
			cardDistance: 34,
			verticalDistance: 28,
		};
	}, [viewportWidth]);

	return (
		<section id="realizacje" className={`page-section ${styles.section}`}>
			<div className={`page-section-inner ${styles.inner}`}>
				<p className="page-section-eyebrow">{ui.eyebrow}</p>

				<div className={styles.stageShell}>
					<div className={styles.stage}>
						<CardSwap
							width={cardLayout.width}
							height={cardLayout.height}
							cardDistance={cardLayout.cardDistance}
							verticalDistance={cardLayout.verticalDistance}
							delay={5200}
							pauseOnHover
							skewAmount={2}
							easing="smooth"
							onReady={handleSwapReady}
							onFrontCardChange={handleFrontCardChange}
						>
							{projects.map((project) => (
								<div
									key={project.id}
									className={`card ${styles.projectCard}`}
									data-tone={project.tone}
									aria-label={`${ui.cardAriaPrefix} ${project.name}`}
								>
									<div className={styles.previewFrame}>
										<div className={styles.previewTopBar}>
											<span />
											<span />
											<span />
										</div>
										<div className={styles.previewBody}>
											{project.previewImage ? (
												<span className={styles.previewImageLabel}>{ui.previewPlaceholder}</span>
											) : (
												<>
													<span className={styles.previewPill}>{project.previewLabel}</span>
													<span className={styles.previewHeadline}>{project.name}</span>
													<span className={styles.previewLine} />
													<span className={styles.previewLineShort} />
												</>
											)}
										</div>
									</div>

									<div className={styles.cardBottom}>
										<div>
											<p className={styles.stackTag}>{project.stack}</p>
											<h3 className={styles.cardTitle}>{project.name}</h3>
											<p className={styles.cardShort}>{project.short}</p>
										</div>

										<div className={styles.cardActions}>
											<a
												href="#realizacje-szczegoly"
												className={styles.infoButton}
												onClick={(event) => event.stopPropagation()}
											>
												<span className={styles.questionMark}>?</span>
												{ui.learnMore}
											</a>
											<a
												href={project.url}
												target="_blank"
												rel="noreferrer"
												className={styles.visitButton}
												onClick={(event) => event.stopPropagation()}
											>
												{ui.openSite}
											</a>
										</div>
									</div>
								</div>
							))}
						</CardSwap>
					</div>

					<div className={styles.swapControls} aria-label={ui.controlsLabel}>
						<button
							type="button"
							className={styles.swapArrow}
							onClick={() => controls?.prev()}
							disabled={!controls}
							aria-label={ui.prevAria}
						>
							<span aria-hidden="true">←</span>
						</button>
						<button
							type="button"
							className={styles.swapArrow}
							onClick={() => controls?.next()}
							disabled={!controls}
							aria-label={ui.nextAria}
						>
							<span aria-hidden="true">→</span>
						</button>
					</div>
				</div>

				{activeProject && (
					<article id="realizacje-szczegoly" className={styles.detailsPanel} aria-live="polite">
						<div className={styles.detailsHeader}>
							<p className={styles.detailsEyebrow}>{ui.detailsEyebrow}</p>
							<h3 className={styles.detailsTitle}>{activeProject.name}</h3>
						</div>
						<p className={styles.detailsDescription}>{activeProject.description}</p>
						<p className={styles.detailsStack}>
							<span>{ui.stackLabel}</span> {activeProject.stack}
						</p>
						<ul className={styles.featureList}>
							{activeProject.features.map((feature) => (
								<li key={feature}>{feature}</li>
							))}
						</ul>
					</article>
				)}
			</div>
		</section>
	);
}
