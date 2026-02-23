import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const HOME_TITLE = "Next.js Websites, Medusa.js and WooCommerce";
const HOME_DESCRIPTION =
	"I build fast websites and e-commerce stores with Next.js, Medusa.js, WooCommerce and AI automation. See projects and book a free consultation.";

export const metadata: Metadata = {
	title: HOME_TITLE,
	description: HOME_DESCRIPTION,
	keywords: [
		"Next.js websites",
		"Medusa.js stores",
		"WooCommerce",
		"web development",
		"e-commerce development",
		"AI automation",
	],
	alternates: {
		canonical: "/en",
		languages: {
			"pl-PL": "/",
			"en-US": "/en",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		alternateLocale: ["pl_PL"],
		url: "https://jakubreszka.pl/en",
		siteName: "Jakub Reszka Portfolio",
		title: "Jakub Reszka | Next.js Websites, Medusa.js and WooCommerce",
		description: HOME_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: HOME_TITLE,
		description: HOME_DESCRIPTION,
	},
};

export default function HomePageEnglishRoute() {
	return <HomePage />;
}
