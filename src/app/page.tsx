import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const HOME_TITLE_BASE = "Strony internetowe Next.js, Medusa.js i aplikacje mobilne";
const HOME_TITLE = `${HOME_TITLE_BASE} | JAKUB RESZKA`;
const HOME_DESCRIPTION =
	"Tworzę szybkie strony internetowe Next.js, sklepy Medusa.js i aplikacje mobilne. Projektuję, wdrażam i rozwijam produkty cyfrowe oraz automatyzacje AI.";
const SOCIAL_IMAGE = "/social-share.png";

export const metadata: Metadata = {
	title: HOME_TITLE,
	description: HOME_DESCRIPTION,
	keywords: [
		"strony internetowe Next.js",
		"sklepy Medusa.js",
		"aplikacje mobilne",
		"tworzenie aplikacji mobilnych",
		"React Native",
		"tworzenie stron www",
		"e-commerce",
		"automatyzacje AI",
	],
	alternates: {
		canonical: "/",
		languages: {
			"pl-PL": "/",
			"en-US": "/en",
		},
	},
	openGraph: {
		type: "website",
		locale: "pl_PL",
		alternateLocale: ["en_US"],
		url: "https://jakubreszka.pl/",
		siteName: "Jakub Reszka Portfolio",
			title: HOME_TITLE,
		description: HOME_DESCRIPTION,
		images: [
			{
				url: SOCIAL_IMAGE,
				width: 1200,
				height: 630,
				alt: "Jakub Reszka - strony internetowe, aplikacje mobilne i automatyzacje AI",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
			title: HOME_TITLE,
		description: HOME_DESCRIPTION,
		images: [SOCIAL_IMAGE],
	},
};

export default function HomePageRoute() {
	return <HomePage />;
}
