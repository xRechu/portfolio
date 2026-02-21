"use client";

import { useMemo, useState } from "react";
import CardSwap from "@/components/CardSwap";
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

const projects: Project[] = [
	{
		id: "wellness-studio",
		name: "Wellness Studio",
		stack: "Next.js + Headless CMS",
		url: "https://example.com",
		short: "Szybka strona uslugowa z naciskiem na SEO i konwersje.",
		description:
			"Projekt skupiony na lead generation. Strona ma lekki frontend, szybki TTFB i modularny edytor tresci dla klienta.",
		features: [
			"Autorski system sekcji landing page z latwa edycja tresci",
			"Optymalizacja Core Web Vitals pod kampanie platne i SEO",
			"Integracja formularzy z automatycznym routingiem leadow",
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
			"Sklep budowany pod skalowanie. Backend Medusa obsluguje niestandardowe promocje i scenariusze koszyka.",
		features: [
			"Autorskie reguly rabatowe i bundle products",
			"Szybki storefront oparty o SSR + cache strategia",
			"Integracje platnosci i panelu logistycznego",
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
		short: "Platforma contentowa z kontami i strefa premium.",
		description:
			"Rozwiazanie dla biznesu edukacyjnego. Obejmuje role userow, dostep warunkowy i skalowalna strukture tresci.",
		features: [
			"Strefa klienta z podzialem uprawnien i subskrypcji",
			"Panel zarzadzania materialami i postepem nauki",
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
			"Wdrozenie dla marki meblowej. Kluczowe byly szybkie listingi produktow i wygodne filtry na urzadzeniach mobilnych.",
		features: [
			"Custom warstwa frontend na WooCommerce API",
			"Autorski konfigurator wariantow i zestawow",
			"Integracja feedow marketingowych i analityki",
		],
		tone: "sand",
		previewLabel: "Product Catalog",
		previewImage: null,
	},
];

export default function RealizationsSection() {
	const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? "");

	const activeProject = useMemo(
		() => projects.find((project) => project.id === activeProjectId) ?? projects[0],
		[activeProjectId]
	);

	return (
		<section id="realizacje" className={`page-section ${styles.section}`}>
			<div className={`page-section-inner ${styles.inner}`}>
				<p className="page-section-eyebrow">Realizacje</p>
				<h2 className="page-section-title">Showcase stron i sklepow, ktore dowoza wynik</h2>
				<p className="page-section-description">
					Kazda karta to osobny projekt. Kliknij <strong>? Dowiedz sie wiecej</strong>, aby zobaczyc stack,
					feature i autorskie rozwiazania.
				</p>

				<div className={styles.stageShell}>
					<div className={styles.stage}>
						<CardSwap
							width={410}
							height={280}
							cardDistance={34}
							verticalDistance={28}
							delay={5200}
							pauseOnHover
							skewAmount={2}
							easing="smooth"
							onCardClick={() => {}}
						>
							{projects.map((project) => (
								<div
									key={project.id}
									className={`card ${styles.projectCard}`}
									data-tone={project.tone}
									aria-label={`Projekt ${project.name}`}
								>
									<div className={styles.previewFrame}>
										<div className={styles.previewTopBar}>
											<span />
											<span />
											<span />
										</div>
										<div className={styles.previewBody}>
											{project.previewImage ? (
												<span className={styles.previewImageLabel}>Podmien na screenshot hero</span>
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
											<button
												type="button"
												className={styles.infoButton}
												onClick={(event) => {
													event.stopPropagation();
													setActiveProjectId(project.id);
												}}
											>
												<span className={styles.questionMark}>?</span>
												Dowiedz sie wiecej
											</button>
											<a
												href={project.url}
												target="_blank"
												rel="noreferrer"
												className={styles.visitButton}
												onClick={(event) => event.stopPropagation()}
											>
												Otworz strone
											</a>
										</div>
									</div>
								</div>
							))}
						</CardSwap>
					</div>
				</div>

				{activeProject && (
					<article className={styles.detailsPanel} aria-live="polite">
						<div className={styles.detailsHeader}>
							<p className={styles.detailsEyebrow}>Szczegoly projektu</p>
							<h3 className={styles.detailsTitle}>{activeProject.name}</h3>
						</div>
						<p className={styles.detailsDescription}>{activeProject.description}</p>
						<p className={styles.detailsStack}>
							<span>Stack:</span> {activeProject.stack}
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
