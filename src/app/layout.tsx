import type { Metadata } from "next";
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/components/LanguageProvider";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const SOCIAL_IMAGE = "/social-share.png";

export const metadata: Metadata = {
	metadataBase: new URL("https://jakubreszka.pl"),
	title: {
		default: "JAKUB RESZKA",
		template: "%s | JAKUB RESZKA",
	},
	description:
		"Portfolio i case studies: Next.js, Medusa.js, aplikacje mobilne oraz automatyzacje AI.",
	keywords: [
		"strony internetowe Next.js",
		"sklepy Medusa.js",
		"aplikacje mobilne",
		"tworzenie aplikacji mobilnych",
		"tworzenie stron www",
		"e-commerce",
		"automatyzacje AI",
		"freelance web developer",
	],
	authors: [{ name: "Jakub Reszka" }],
	creator: "Jakub Reszka",
	publisher: "Jakub Reszka",
	openGraph: {
		type: "website",
		locale: "pl_PL",
		alternateLocale: ["en_US"],
		siteName: "Jakub Reszka Portfolio",
		title: "Jakub Reszka | Next.js, E-commerce, AI",
		description:
			"Portfolio i case studies: Next.js, Medusa.js, aplikacje mobilne oraz automatyzacje AI.",
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
		title: "Jakub Reszka | Next.js, E-commerce, AI",
		description:
			"Portfolio i case studies: Next.js, Medusa.js, aplikacje mobilne oraz automatyzacje AI.",
		images: [SOCIAL_IMAGE],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
		shortcut: ["/favicon.svg"],
	},
};

function resolveInitialLanguage(pathnameHeader: string | null, acceptLanguageHeader: string | null) {
	if (pathnameHeader === "/en" || pathnameHeader?.startsWith("/en/")) {
		return "en";
	}

	if (pathnameHeader?.startsWith("/")) {
		return "pl";
	}

	if (!acceptLanguageHeader) {
		return "pl";
	}

	const normalizedHeader = acceptLanguageHeader.toLowerCase();
	return /(?:^|,)\s*pl(?:-|;|,|$)/.test(normalizedHeader) ? "pl" : "en";
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const initialLanguage = resolveInitialLanguage(
		headersList.get("x-url-pathname"),
		headersList.get("accept-language"),
	);

	return (
		<html lang={initialLanguage} data-theme-preview="light">
			<body className={geistSans.variable}>
				<LanguageProvider initialLanguage={initialLanguage} usePersistedLanguage={false}>
					{children}
					<CookieBanner />
				</LanguageProvider>
			</body>
		</html>
	);
}
