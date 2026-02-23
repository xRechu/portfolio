import type { Metadata } from "next";
import PrivacyPolicyPage from "@/app/polityka-prywatnosci/page";

const TITLE = "Privacy Policy";
const DESCRIPTION =
	"Privacy policy for Jakub Reszka portfolio: data processing scope, legal bases, data recipients, retention and user rights.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: {
		canonical: "/en/polityka-prywatnosci",
		languages: {
			"pl-PL": "/polityka-prywatnosci",
			"en-US": "/en/polityka-prywatnosci",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://jakubreszka.pl/en/polityka-prywatnosci",
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

export default function EnglishPrivacyPolicyRoute() {
	return <PrivacyPolicyPage />;
}

