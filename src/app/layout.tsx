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

export const metadata: Metadata = {
	metadataBase: new URL("https://jakubreszka.pl"),
	title: {
		default: "Jakub Reszka | Strony internetowe Next.js, Medusa.js i WooCommerce",
		template: "%s | Jakub Reszka",
	},
	description:
		"Tworzę szybkie strony internetowe i sklepy e-commerce: Next.js, Medusa.js, WooCommerce oraz automatyzacje AI. Zobacz realizacje i umów darmową konsultację.",
	keywords: [
		"strony internetowe Next.js",
		"sklepy Medusa.js",
		"WooCommerce",
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
		siteName: "Jakub Reszka Portfolio",
		title: "Jakub Reszka | Strony internetowe Next.js, Medusa.js i WooCommerce",
		description:
			"Nowoczesne strony i sklepy nastawione na konwersję, leady i wydajność. Next.js, Medusa.js, WooCommerce, automatyzacje AI.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Jakub Reszka | Strony internetowe Next.js, Medusa.js i WooCommerce",
		description:
			"Nowoczesne strony i sklepy nastawione na konwersję, leady i wydajność. Next.js, Medusa.js, WooCommerce, automatyzacje AI.",
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

function resolveInitialLanguage(acceptLanguageHeader: string | null) {
	if (!acceptLanguageHeader) {
		return "en";
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
	const initialLanguage = resolveInitialLanguage(headersList.get("accept-language"));

	return (
		<html lang={initialLanguage} data-theme-preview="light">
			<body className={geistSans.variable}>
				<LanguageProvider initialLanguage={initialLanguage}>
					{children}
					<CookieBanner />
				</LanguageProvider>
			</body>
		</html>
	);
}
