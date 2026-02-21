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
			id: "falko-project",
			name: "Falko Project",
			url: "https://falkoprojects.com",
			stack: "Medusa.js + Next.js + Admin",
			short: "Sklep modowy z automatyzacją wysyłek, zwrotów i księgowości.",
			description:
				"Sklep dla marki odzieżowej z autorskimi integracjami operacyjnymi i zapleczem sprzedażowym szytym na miarę.",
			features: [
				"Furgonetka: import zamówień, etykiety, Szybkie Zwroty i automatyczne faktury KSeF",
				"Autorska integracja Paynow z obsługą zwrotów z panelu administracyjnego",
				"Program lojalnościowy, scenariusze e-mail/newsletter, bezpieczna baza i Redis cache",
			],
			tone: "ocean",
			previewLabel: "Fashion Store",
			previewImage: null,
		},
		{
			id: "concierge-art",
			name: "Concierge Art",
			url: "https://concierge.reszka-jakub.workers.dev",
			stack: "Medusa.js + Next.js + Admin",
			short: "E-commerce dla galerii sztuki z naciskiem na sprawną obsługę zamówień.",
			description:
				"Sklep internetowy galerii sztuki oparty o Medusa.js i Next.js, przygotowany pod sprzedaż i procesy posprzedażowe.",
			features: [
				"Furgonetka: import zamówień, etykiety, Szybkie Zwroty i automatyczne faktury KSeF",
				"Autorska integracja Paynow z refundami z poziomu panelu administracyjnego",
				"E-maile pod wydarzenia, bezpieczna baza danych i Redis cache",
			],
			tone: "graphite",
			previewLabel: "Art Store",
			previewImage: null,
		},
		{
			id: "mudlaffi",
			name: "Mudlaffi",
			url: "https://mudlaffi.pl",
			stack: "WooCommerce + WordPress + Admin",
			short: "Sklep z treningami online dla marki influencerki sportowej.",
			description:
				"Wdrożenie WooCommerce z dedykowanym modułem bezpiecznej dystrybucji materiałów wideo dla produktów cyfrowych.",
			features: [
				"Autorski system zabezpieczonych wideo z dynamicznym znakiem wodnym",
				"Blokada pobierania materiałów i kontrola dostępu do treści",
				"Panel administracyjny pod sprzedaż i obsługę programów treningowych",
			],
			tone: "mint",
			previewLabel: "Online Training",
			previewImage: null,
		},
		{
			id: "blueprint",
			name: "Blueprint",
			url: "https://blueprintstudio.pl",
			stack: "WordPress",
			short: "Landing page dla producentów odzieży nastawiony na zapytania ofertowe.",
			description:
				"Strona typu landing page zaprojektowana pod czytelny przekaz oferty i szybkie przejście do kontaktu.",
			features: [
				"Projekt i wdrożenie one-page na WordPress",
				"Sekcje sprzedażowe z mocnym CTA do zapytań",
				"Łatwa edycja treści w panelu administracyjnym",
			],
			tone: "sand",
			previewLabel: "Landing Page",
			previewImage: null,
		},
	],
	en: [
		{
			id: "falko-project",
			name: "Falko Project",
			url: "https://falkoprojects.com",
			stack: "Medusa.js + Next.js + Admin",
			short: "Fashion e-commerce with custom shipping, returns and finance automation.",
			description:
				"Store implementation for a fashion brand with custom operational integrations and tailored sales workflows.",
			features: [
				"Furgonetka integration: order import, shipping labels, fast returns and automated KSeF invoices",
				"Custom Paynow gateway integration with admin-level refund handling",
				"Custom loyalty flow, event email/newsletter setup, secure DB and Redis cache",
			],
			tone: "ocean",
			previewLabel: "Fashion Store",
			previewImage: null,
		},
		{
			id: "concierge-art",
			name: "Concierge Art",
			url: "https://concierge.reszka-jakub.workers.dev",
			stack: "Medusa.js + Next.js + Admin",
			short: "Online store for an art gallery with reliable order operations.",
			description:
				"E-commerce for an art gallery built with Medusa.js and Next.js, optimized for sales and post-purchase operations.",
			features: [
				"Furgonetka integration for order import, labels, fast returns and KSeF invoice automation",
				"Custom Paynow integration with refund actions from the admin panel",
				"Event-based email flows, secure database setup and Redis cache",
			],
			tone: "graphite",
			previewLabel: "Art Store",
			previewImage: null,
		},
		{
			id: "mudlaffi",
			name: "Mudlaffi",
			url: "https://mudlaffi.pl",
			stack: "WooCommerce + WordPress + Admin",
			short: "Store with online training access for a sports influencer brand.",
			description:
				"WooCommerce implementation with a custom secure video delivery layer for digital training products.",
			features: [
				"Custom secured video module with dynamic watermarking",
				"Download blocking and controlled access to video materials",
				"Admin workflow for training sales and content handling",
			],
			tone: "mint",
			previewLabel: "Online Training",
			previewImage: null,
		},
		{
			id: "blueprint",
			name: "Blueprint",
			url: "https://blueprintstudio.pl",
			stack: "WordPress",
			short: "Landing page for apparel manufacturers focused on lead capture.",
			description:
				"WordPress landing page designed for clear offer communication and fast contact conversion.",
			features: [
				"Custom one-page WordPress implementation",
				"Sales-oriented sections with strong CTA placement",
				"Simple content editing in the admin panel",
			],
			tone: "sand",
			previewLabel: "Landing Page",
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

		if (viewportWidth < 900) {
			return {
				width: Math.max(320, Math.min(380, viewportWidth - 94)),
				height: 252,
				cardDistance: 26,
				verticalDistance: 20,
			};
		}

		if (viewportWidth < 1200) {
			return {
				width: Math.max(390, Math.min(442, viewportWidth - 182)),
				height: 272,
				cardDistance: 31,
				verticalDistance: 24,
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
