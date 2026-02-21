import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type AppLanguage = "pl" | "en";
type ContactReason = "business_website" | "ecommerce_store" | "automation_ai" | "audit_improvements" | "other";

type ContactPayload = {
	name?: unknown;
	email?: unknown;
	phone?: unknown;
	reason?: unknown;
	message?: unknown;
	company?: unknown;
	language?: unknown;
	requestId?: unknown;
	startedAt?: unknown;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const submissionLog = new Map<string, number[]>();

const reasonsLabels: Record<AppLanguage, Record<ContactReason, string>> = {
	pl: {
		business_website: "Nowa strona firmowa",
		ecommerce_store: "Sklep e-commerce",
		automation_ai: "Automatyzacje / AI",
		audit_improvements: "Audyt i poprawki",
		other: "Inny temat",
	},
	en: {
		business_website: "New business website",
		ecommerce_store: "E-commerce store",
		automation_ai: "Automation / AI",
		audit_improvements: "Audit and improvements",
		other: "Other topic",
	},
};

const responseMessages = {
	pl: {
		success: "Dzięki. Wiadomość została wysłana.",
		invalid: "Sprawdź pola formularza i spróbuj ponownie.",
		rateLimit: "Wysłałeś zbyt wiele zapytań. Spróbuj ponownie za kilka minut.",
		error: "Nie udało się wysłać formularza. Spróbuj ponownie za chwilę.",
	},
	en: {
		success: "Thanks. Your message has been sent.",
		invalid: "Please review the form fields and try again.",
		rateLimit: "Too many submissions. Please try again in a few minutes.",
		error: "The form could not be sent. Please try again shortly.",
	},
} as const;

function normalizeString(value: unknown) {
	if (typeof value !== "string") {
		return "";
	}

	return value.trim().replace(/\s+/g, " ");
}

function resolveLanguage(value: unknown): AppLanguage {
	return value === "pl" ? "pl" : "en";
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function isReason(value: string): value is ContactReason {
	return value === "business_website" || value === "ecommerce_store" || value === "automation_ai" || value === "audit_improvements" || value === "other";
}

function isRateLimited(key: string) {
	const now = Date.now();
	const timestamps = submissionLog.get(key) ?? [];
	const activeTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

	if (activeTimestamps.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
		submissionLog.set(key, activeTimestamps);
		return true;
	}

	activeTimestamps.push(now);
	submissionLog.set(key, activeTimestamps);
	return false;
}

function validatePayload(payload: ContactPayload) {
	const name = normalizeString(payload.name);
	const email = normalizeString(payload.email).toLowerCase();
	const phone = normalizeString(payload.phone);
	const reason = normalizeString(payload.reason);
	const message = normalizeString(payload.message);
	const company = normalizeString(payload.company);
	const requestId = normalizeString(payload.requestId);
	const startedAtValue = typeof payload.startedAt === "number" ? payload.startedAt : Number(payload.startedAt);

	const phoneDigits = phone.replace(/\D/g, "");
	const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	if (name.length < 2 || name.length > 80) {
		return null;
	}

	if (!isEmailValid || email.length > 254) {
		return null;
	}

	if (phoneDigits.length < 7 || phone.length > 30) {
		return null;
	}

	if (!isReason(reason)) {
		return null;
	}

	if (message.length > 1200) {
		return null;
	}

	if (requestId.length < 8 || requestId.length > 120) {
		return null;
	}

	if (!Number.isFinite(startedAtValue)) {
		return null;
	}

	return {
		name,
		email,
		phone,
		reason,
		message,
		company,
		requestId,
		startedAt: startedAtValue,
	};
}

export async function POST(request: NextRequest) {
	let payload: ContactPayload;

	try {
		payload = (await request.json()) as ContactPayload;
	} catch {
		return NextResponse.json({ message: responseMessages.en.invalid }, { status: 400 });
	}

	const language = resolveLanguage(payload.language);
	const messages = responseMessages[language];
	const parsed = validatePayload(payload);

	if (!parsed) {
		return NextResponse.json({ message: messages.invalid }, { status: 400 });
	}

	// Honeypot field to silently drop simple bot submissions.
	if (parsed.company.length > 0) {
		return NextResponse.json({ message: messages.success }, { status: 200 });
	}

	// Very fast submissions are often automated bots.
	if (Date.now() - parsed.startedAt < 1800) {
		return NextResponse.json({ message: messages.rateLimit }, { status: 429 });
	}

	const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
	if (isRateLimited(ipAddress)) {
		return NextResponse.json({ message: messages.rateLimit }, { status: 429 });
	}

	const resendApiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.RESEND_FROM_EMAIL;
	const toEmail = process.env.CONTACT_TO_EMAIL;

	if (!resendApiKey || !fromEmail || !toEmail) {
		console.error("Missing contact form email env vars: RESEND_API_KEY / RESEND_FROM_EMAIL / CONTACT_TO_EMAIL.");
		return NextResponse.json({ message: messages.error }, { status: 500 });
	}

	const resend = new Resend(resendApiKey);
	const reasonLabel = reasonsLabels[language][parsed.reason];
	const messageBody = parsed.message || (language === "pl" ? "Brak dodatkowej wiadomości." : "No additional message.");

	const safeName = escapeHtml(parsed.name);
	const safeEmail = escapeHtml(parsed.email);
	const safePhone = escapeHtml(parsed.phone);
	const safeReason = escapeHtml(reasonLabel);
	const safeMessage = escapeHtml(messageBody);
	const safeLanguage = escapeHtml(language.toUpperCase());

	const subject =
		language === "pl" ? `[Portfolio] ${reasonLabel} - ${parsed.name}` : `[Portfolio] ${reasonLabel} - ${parsed.name}`;

	try {
		const { error } = await resend.emails.send(
			{
				from: fromEmail,
				to: [toEmail],
				replyTo: parsed.email,
				subject,
					text:
						language === "pl"
							? `Nowe zapytanie z formularza\n\nImię i nazwisko: ${parsed.name}\nE-mail: ${parsed.email}\nTelefon: ${parsed.phone}\nCel kontaktu: ${reasonLabel}\nJęzyk: ${language.toUpperCase()}\n\nWiadomość:\n${messageBody}`
							: `New form inquiry\n\nName: ${parsed.name}\nEmail: ${parsed.email}\nPhone: ${parsed.phone}\nContact purpose: ${reasonLabel}\nLanguage: ${language.toUpperCase()}\n\nMessage:\n${messageBody}`,
				html: `
					<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
						<h2 style="margin:0 0 12px;">${language === "pl" ? "Nowe zapytanie z formularza" : "New form inquiry"}</h2>
						<p><strong>${language === "pl" ? "Imię i nazwisko" : "Name"}:</strong> ${safeName}</p>
						<p><strong>E-mail:</strong> ${safeEmail}</p>
						<p><strong>${language === "pl" ? "Telefon" : "Phone"}:</strong> ${safePhone}</p>
						<p><strong>${language === "pl" ? "Cel kontaktu" : "Contact purpose"}:</strong> ${safeReason}</p>
						<p><strong>${language === "pl" ? "Język" : "Language"}:</strong> ${safeLanguage}</p>
						<p style="margin:18px 0 6px;"><strong>${language === "pl" ? "Wiadomość" : "Message"}:</strong></p>
						<p style="white-space:pre-line;margin:0;">${safeMessage}</p>
					</div>
				`,
			},
			{
				headers: {
					"Idempotency-Key": `contact-${parsed.requestId}`,
				},
			}
		);

		if (error) {
			console.error("Resend contact send failed:", error);
			return NextResponse.json({ message: messages.error }, { status: 500 });
		}

		return NextResponse.json({ message: messages.success }, { status: 200 });
	} catch (error) {
		console.error("Resend contact send error:", error);
		return NextResponse.json({ message: messages.error }, { status: 500 });
	}
}
