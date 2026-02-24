"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useLanguage, type AppLanguage } from "@/components/LanguageProvider";
import styles from "./ContactSection.module.css";

type ContactReason =
	| "business_website"
	| "ecommerce_store"
	| "mobile_app"
	| "automation_ai"
	| "audit_improvements"
	| "other";

type FormValues = {
	name: string;
	email: string;
	phone: string;
	reason: ContactReason | "";
	message: string;
	company: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ContactCopy = {
	eyebrow: string;
	title?: string;
	description?: string;
	labels: {
		name: string;
		email: string;
		phone: string;
		reason: string;
		message: string;
		messageOptional: string;
	};
	placeholders: {
		name: string;
		email: string;
		phone: string;
		reason: string;
		message: string;
	};
	reasons: { value: ContactReason; label: string }[];
	ctaIdle: string;
	ctaLoading: string;
	success: string;
	error: string;
	footer: string;
	validation: {
		name: string;
		email: string;
		phone: string;
		reason: string;
		message: string;
	};
};

const copyByLanguage: Record<AppLanguage, ContactCopy> = {
	pl: {
		eyebrow: "Kontakt",
		title: "Darmowa konsultacja i wstępna wycena",
		description: "Wypełnij krótki formularz. Otrzymasz rekomendowany kierunek i kolejne kroki dla swojego projektu.",
		labels: {
			name: "Imię i nazwisko",
			email: "Adres e-mail",
			phone: "Numer telefonu",
			reason: "W jakim celu się kontaktujesz?",
			message: "Wiadomość",
			messageOptional: "opcjonalnie",
		},
		placeholders: {
			name: "Np. Jan Kowalski",
			email: "jan@firma.pl",
			phone: "+48 000 000 000",
			reason: "Wybierz cel kontaktu",
			message: "Napisz 2-3 zdania o projekcie, zakresie lub problemie.",
		},
		reasons: [
			{ value: "business_website", label: "Nowa strona firmowa" },
			{ value: "ecommerce_store", label: "Sklep e-commerce" },
			{ value: "mobile_app", label: "Aplikacja mobilna" },
			{ value: "automation_ai", label: "Automatyzacje / AI" },
			{ value: "audit_improvements", label: "Audyt i poprawki" },
			{ value: "other", label: "Inny temat" },
		],
		ctaIdle: "Wyślij zapytanie",
		ctaLoading: "Wysyłanie...",
		success: "Dzięki. Wiadomość wysłana - odezwę się najszybciej jak to możliwe.",
		error: "Nie udało się wysłać formularza. Spróbuj ponownie za chwilę.",
		footer: "Formularz jest zabezpieczony. Dane są używane wyłącznie do kontaktu w sprawie zapytania.",
		validation: {
			name: "Wpisz imię i nazwisko (min. 2 znaki).",
			email: "Wpisz poprawny adres e-mail.",
			phone: "Wpisz numer telefonu (min. 7 cyfr).",
			reason: "Wybierz cel kontaktu.",
			message: "Wiadomość może mieć maksymalnie 1200 znaków.",
		},
	},
	en: {
		eyebrow: "Contact",
		title: "Free consultation and initial estimate",
		description:
			"Fill out this short form. You will get a recommended direction and next steps for your project.",
		labels: {
			name: "Full name",
			email: "Email address",
			phone: "Phone number",
			reason: "What is the main purpose of your inquiry?",
			message: "Message",
			messageOptional: "optional",
		},
		placeholders: {
			name: "e.g. John Smith",
			email: "john@company.com",
			phone: "+1 000 000 0000",
			reason: "Select contact purpose",
			message: "Write 2-3 lines about your scope, goal or current issue.",
		},
		reasons: [
			{ value: "business_website", label: "New business website" },
			{ value: "ecommerce_store", label: "E-commerce store" },
			{ value: "mobile_app", label: "Mobile app" },
			{ value: "automation_ai", label: "Automation / AI" },
			{ value: "audit_improvements", label: "Audit and improvements" },
			{ value: "other", label: "Other topic" },
		],
		ctaIdle: "Send inquiry",
		ctaLoading: "Sending...",
		success: "Thanks. Your message has been sent - I will get back to you shortly.",
		error: "The form could not be sent. Please try again in a moment.",
		footer: "This form is protected. Data is used only for responding to this inquiry.",
		validation: {
			name: "Enter your full name (at least 2 characters).",
			email: "Enter a valid email address.",
			phone: "Enter a phone number (at least 7 digits).",
			reason: "Select a contact purpose.",
			message: "Message can be up to 1200 characters.",
		},
	},
};

const DEFAULT_VALUES: FormValues = {
	name: "",
	email: "",
	phone: "",
	reason: "",
	message: "",
	company: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(values: FormValues, copy: ContactCopy): FormErrors {
	const errors: FormErrors = {};

	if (values.name.trim().length < 2) {
		errors.name = copy.validation.name;
	}

	if (!emailRegex.test(values.email.trim())) {
		errors.email = copy.validation.email;
	}

	const phoneDigits = values.phone.replace(/\D/g, "");
	if (phoneDigits.length < 7) {
		errors.phone = copy.validation.phone;
	}

	if (!values.reason) {
		errors.reason = copy.validation.reason;
	}

	if (values.message.length > 1200) {
		errors.message = copy.validation.message;
	}

	return errors;
}

export default function ContactSection() {
	const { language } = useLanguage();
	const copy = useMemo(() => copyByLanguage[language], [language]);
	const startedAtRef = useRef(Date.now());

	const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

	const onFieldChange = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
		setValues((current) => ({ ...current, [key]: value }));
		setErrors((current) => {
			if (!current[key]) return current;
			const next = { ...current };
			delete next[key];
			return next;
		});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextErrors = validateForm(values, copy);
		setErrors(nextErrors);
		setSubmitMessage("");
		setSubmitStatus("idle");

		if (Object.keys(nextErrors).length > 0) {
			return;
		}

		setIsSubmitting(true);

		try {
			const requestId =
				typeof window !== "undefined" && typeof window.crypto?.randomUUID === "function"
					? window.crypto.randomUUID()
					: `${Date.now()}-${Math.random().toString(16).slice(2)}`;

			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...values,
					language,
					requestId,
					startedAt: startedAtRef.current,
				}),
			});

			const payload = (await response.json()) as { message?: string };

			if (!response.ok) {
				setSubmitStatus("error");
				setSubmitMessage(payload.message || copy.error);
				return;
			}

			setSubmitStatus("success");
			setSubmitMessage(payload.message || copy.success);
			setValues(DEFAULT_VALUES);
			startedAtRef.current = Date.now();
		} catch {
			setSubmitStatus("error");
			setSubmitMessage(copy.error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="kontakt" className={`page-section ${styles.section}`}>
			<div className={`page-section-inner ${styles.inner}`}>
				<p className="page-section-eyebrow">{copy.eyebrow}</p>
				{copy.title ? <h2 className="page-section-title">{copy.title}</h2> : null}
				{copy.description ? <p className="page-section-description">{copy.description}</p> : null}

				<form className={styles.formCard} onSubmit={handleSubmit} noValidate>
					<div className={styles.grid}>
						<div className={styles.field}>
							<label htmlFor="contact-name">{copy.labels.name}</label>
							<input
								id="contact-name"
								type="text"
								autoComplete="name"
								required
								maxLength={80}
								placeholder={copy.placeholders.name}
								value={values.name}
								onChange={(event) => onFieldChange("name", event.target.value)}
								aria-invalid={Boolean(errors.name)}
								aria-describedby={errors.name ? "contact-name-error" : undefined}
							/>
							{errors.name ? (
								<p id="contact-name-error" className={styles.error}>
									{errors.name}
								</p>
							) : null}
						</div>

						<div className={styles.field}>
							<label htmlFor="contact-email">{copy.labels.email}</label>
							<input
								id="contact-email"
								type="email"
								autoComplete="email"
								inputMode="email"
								required
								maxLength={254}
								placeholder={copy.placeholders.email}
								value={values.email}
								onChange={(event) => onFieldChange("email", event.target.value)}
								aria-invalid={Boolean(errors.email)}
								aria-describedby={errors.email ? "contact-email-error" : undefined}
							/>
							{errors.email ? (
								<p id="contact-email-error" className={styles.error}>
									{errors.email}
								</p>
							) : null}
						</div>

						<div className={styles.field}>
							<label htmlFor="contact-phone">{copy.labels.phone}</label>
							<input
								id="contact-phone"
								type="tel"
								autoComplete="tel"
								inputMode="tel"
								required
								maxLength={30}
								placeholder={copy.placeholders.phone}
								value={values.phone}
								onChange={(event) => onFieldChange("phone", event.target.value)}
								aria-invalid={Boolean(errors.phone)}
								aria-describedby={errors.phone ? "contact-phone-error" : undefined}
							/>
							{errors.phone ? (
								<p id="contact-phone-error" className={styles.error}>
									{errors.phone}
								</p>
							) : null}
						</div>

						<div className={styles.field}>
							<label htmlFor="contact-reason">{copy.labels.reason}</label>
							<select
								id="contact-reason"
								value={values.reason}
								required
								onChange={(event) => onFieldChange("reason", event.target.value as ContactReason | "")}
								aria-invalid={Boolean(errors.reason)}
								aria-describedby={errors.reason ? "contact-reason-error" : undefined}
							>
								<option value="">{copy.placeholders.reason}</option>
								{copy.reasons.map((reasonOption) => (
									<option key={reasonOption.value} value={reasonOption.value}>
										{reasonOption.label}
									</option>
								))}
							</select>
							{errors.reason ? (
								<p id="contact-reason-error" className={styles.error}>
									{errors.reason}
								</p>
							) : null}
						</div>

						<div className={`${styles.field} ${styles.fieldFull}`}>
							<label htmlFor="contact-message">
								{copy.labels.message} <span>{copy.labels.messageOptional}</span>
							</label>
							<textarea
								id="contact-message"
								rows={5}
								maxLength={1200}
								placeholder={copy.placeholders.message}
								value={values.message}
								onChange={(event) => onFieldChange("message", event.target.value)}
								aria-invalid={Boolean(errors.message)}
								aria-describedby={errors.message ? "contact-message-error" : undefined}
							/>
							<div className={styles.fieldBottom}>
								{errors.message ? (
									<p id="contact-message-error" className={styles.error}>
										{errors.message}
									</p>
								) : (
									<span />
								)}
								<span className={styles.counter}>{values.message.length}/1200</span>
							</div>
						</div>
					</div>

					<div className={styles.honeypot} aria-hidden="true">
						<label htmlFor="contact-company">Company</label>
						<input
							id="contact-company"
							type="text"
							tabIndex={-1}
							autoComplete="off"
							value={values.company}
							onChange={(event) => onFieldChange("company", event.target.value)}
						/>
					</div>

					<div className={styles.footer}>
						<button type="submit" disabled={isSubmitting} className={styles.submitButton}>
							{isSubmitting ? copy.ctaLoading : copy.ctaIdle}
						</button>
						<p className={styles.disclaimer}>{copy.footer}</p>
					</div>

					{submitMessage ? (
						<p
							role={submitStatus === "success" ? "status" : "alert"}
							aria-live="polite"
							className={`${styles.submitMessage} ${submitStatus === "success" ? styles.success : styles.failure}`}
						>
							{submitMessage}
						</p>
					) : null}
				</form>
			</div>
		</section>
	);
}
