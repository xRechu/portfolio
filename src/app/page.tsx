import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const HOME_TITLE = "Strony internetowe Next.js, Medusa.js i WooCommerce";
const HOME_DESCRIPTION =
	"Tworze szybkie strony internetowe i sklepy e-commerce: Next.js, Medusa.js, WooCommerce oraz automatyzacje AI. Zobacz realizacje i umow darmowa konsultacje.";

export const metadata: Metadata = {
	title: HOME_TITLE,
	description: HOME_DESCRIPTION,
	keywords: [
		"strony internetowe Next.js",
		"sklepy Medusa.js",
		"WooCommerce",
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
		title: "Jakub Reszka | Strony internetowe Next.js, Medusa.js i WooCommerce",
		description: HOME_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: HOME_TITLE,
		description: HOME_DESCRIPTION,
	},
};

export default function HomePageRoute() {
	return <HomePage />;
}
