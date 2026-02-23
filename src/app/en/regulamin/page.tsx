import type { Metadata } from "next";
import TermsPage from "@/app/regulamin/page";

const TITLE = "Website Terms";
const DESCRIPTION =
	"Terms of use for Jakub Reszka portfolio website: service scope, contact form rules, liability and final provisions.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: {
		canonical: "/en/regulamin",
		languages: {
			"pl-PL": "/regulamin",
			"en-US": "/en/regulamin",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://jakubreszka.pl/en/regulamin",
		title: TITLE,
		description: DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: TITLE,
		description: DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function EnglishTermsRoute() {
	return <TermsPage />;
}

