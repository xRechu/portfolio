import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const HOME_TITLE = "Next.js websites, Medusa.js and mobile apps";
const HOME_DESCRIPTION =
	"I build fast Next.js websites, Medusa.js stores and mobile apps. I design, ship and scale digital products with technical SEO and AI automation.";

export const metadata: Metadata = {
	title: HOME_TITLE,
	description: HOME_DESCRIPTION,
	keywords: [
		"Next.js websites",
		"Medusa.js stores",
		"mobile app development",
		"mobile apps",
		"React Native development",
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
		title: `${HOME_TITLE} | JAKUB RESZKA`,
		description: HOME_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: `${HOME_TITLE} | JAKUB RESZKA`,
		description: HOME_DESCRIPTION,
	},
};

export default function HomePageEnglishRoute() {
	return <HomePage />;
}
