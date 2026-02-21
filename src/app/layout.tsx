import type { Metadata } from "next";
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/components/LanguageProvider";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Portfolio",
	description: "Portfolio",
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
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<LanguageProvider initialLanguage={initialLanguage}>
					{children}
					<CookieBanner />
				</LanguageProvider>
			</body>
		</html>
	);
}
