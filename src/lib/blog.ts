import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

const SITE_URL = "https://jakubreszka.pl";
const BLOG_DIR = path.join(process.cwd(), "blog");
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const SUPPORTED_EXTENSIONS = new Set([".md", ".markdown"]);
const BLOG_PATH_BY_LANGUAGE = {
	pl: "/blog",
	en: "/en/blog",
} as const;

export type BlogLanguage = "pl" | "en";

const BLOG_LANGUAGE_SET = new Set<BlogLanguage>(["pl", "en"]);

type Frontmatter = {
	title?: string;
	date?: string;
	updated?: string;
	excerpt?: string;
	tags?: string;
	coverImage?: string;
	coverAlt?: string;
	seoTitle?: string;
	seoDescription?: string;
	canonicalUrl?: string;
	slug?: string;
	draft?: string;
	lang?: string;
	translationKey?: string;
};

type MarkdownContext = {
	slug: string;
};

type ParsedBlogPost = {
	draft: boolean;
	language: BlogLanguage;
	translationKey: string;
	slug: string;
	title: string;
	excerpt: string;
	publishedAt: string;
	updatedAt: string;
	tags: string[];
	coverImage: string | null;
	coverAlt: string | null;
	seoTitle: string | null;
	seoDescription: string | null;
	canonicalUrl: string;
	readingTimeMinutes: number;
	contentMarkdown: string;
	contentHtml: string;
};

export type BlogPostSummary = Omit<ParsedBlogPost, "contentMarkdown" | "contentHtml" | "draft">;

export type BlogPost = Omit<ParsedBlogPost, "draft">;

function stripOuterQuotes(value: string): string {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1).trim();
	}

	return trimmed;
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
	const match = content.match(FRONTMATTER_PATTERN);
	if (!match) {
		return { frontmatter: {}, body: content };
	}

	const rawEntries = match[1].split(/\r?\n/);
	const entries: Record<string, string> = {};

	for (const line of rawEntries) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const separatorIndex = trimmed.indexOf(":");
		if (separatorIndex === -1) {
			continue;
		}

		const key = trimmed.slice(0, separatorIndex).trim().toLowerCase();
		const value = stripOuterQuotes(trimmed.slice(separatorIndex + 1));
		if (!key || !value) {
			continue;
		}

		entries[key] = value;
	}

	return {
		frontmatter: {
			title: entries.title,
			date: entries.date,
			updated: entries.updated,
			excerpt: entries.excerpt,
			tags: entries.tags,
			coverImage: entries.coverimage ?? entries.cover_image,
			coverAlt: entries.coveralt ?? entries.cover_alt,
			seoTitle: entries.seotitle ?? entries.seo_title,
			seoDescription: entries.seodescription ?? entries.seo_description,
			canonicalUrl: entries.canonicalurl ?? entries.canonical_url,
			slug: entries.slug,
			draft: entries.draft,
			lang: entries.lang,
			translationKey: entries.translationkey ?? entries.translation_key,
		},
		body: match[2].trim(),
	};
}

function slugify(value: string): string {
	const normalized = value
		.toLowerCase()
		.trim()
		.replace(/\.[a-z0-9]+$/i, "")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

	return normalized || "post";
}

function normalizeSlug(frontmatterSlug: string | undefined, fileName: string): string {
	const source = frontmatterSlug?.trim() || fileName;
	return slugify(source);
}

function normalizeTranslationKey(
	frontmatterTranslationKey: string | undefined,
	fileName: string,
	fallbackSlug: string,
): string {
	const source = frontmatterTranslationKey?.trim() || fileName || fallbackSlug;
	return slugify(source);
}

function parseLanguage(rawLanguage: string | undefined, fileLanguage: BlogLanguage | null): BlogLanguage {
	if (fileLanguage) {
		return fileLanguage;
	}

	const normalized = rawLanguage?.trim().toLowerCase();
	if (normalized && BLOG_LANGUAGE_SET.has(normalized as BlogLanguage)) {
		return normalized as BlogLanguage;
	}

	return "pl";
}

function parseFileIdentity(fileName: string): { baseName: string; fileLanguage: BlogLanguage | null } {
	const extension = path.extname(fileName);
	const stem = extension ? fileName.slice(0, -extension.length) : fileName;
	const languageMatch = stem.match(/^(.*)\.(pl|en)$/i);
	if (!languageMatch) {
		return {
			baseName: stem,
			fileLanguage: null,
		};
	}

	return {
		baseName: languageMatch[1],
		fileLanguage: languageMatch[2].toLowerCase() as BlogLanguage,
	};
}

function titleFromSlug(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
		.join(" ");
}

function parseDate(value: string | undefined, fallbackDate: Date): string {
	if (!value) {
		return fallbackDate.toISOString();
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return fallbackDate.toISOString();
	}

	return parsedDate.toISOString();
}

function parseTags(value: string | undefined): string[] {
	if (!value) {
		return [];
	}

	const normalized = value
		.replace(/^\[/, "")
		.replace(/\]$/, "")
		.split(",")
		.map((tag) => stripOuterQuotes(tag))
		.map((tag) => tag.trim())
		.filter(Boolean);

	return Array.from(new Set(normalized));
}

function parseBoolean(value: string | undefined): boolean {
	if (!value) {
		return false;
	}

	return ["1", "true", "yes", "y", "tak"].includes(value.trim().toLowerCase());
}

function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/^#{1,6}\s+/gm, " ")
		.replace(/^>\s?/gm, " ")
		.replace(/^[-*+]\s+/gm, " ")
		.replace(/^\d+\.\s+/gm, " ")
		.replace(/[*_~]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function createExcerpt(markdown: string, maxLength = 190): string {
	const plainText = stripMarkdown(markdown);
	if (!plainText) {
		return "Nowy wpis na blogu.";
	}

	if (plainText.length <= maxLength) {
		return plainText;
	}

	const clipped = plainText.slice(0, maxLength);
	const clippedAtWord = clipped.slice(0, Math.max(clipped.lastIndexOf(" "), 0)).trim();
	return `${clippedAtWord || clipped}...`;
}

function estimateReadingTime(markdown: string): number {
	const words = stripMarkdown(markdown)
		.split(/\s+/)
		.filter(Boolean).length;

	return Math.max(1, Math.ceil(words / 220));
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function sanitizeAbsoluteUrl(url: string, kind: "link" | "image" | "canonical"): string | null {
	try {
		const parsed = new URL(url);
		const allowedProtocols =
			kind === "link"
				? new Set(["http:", "https:", "mailto:", "tel:"])
				: new Set(["http:", "https:"]);

		if (!allowedProtocols.has(parsed.protocol)) {
			return null;
		}

		return url;
	} catch {
		return null;
	}
}

function normalizeRelativePath(rawPath: string): string | null {
	const pathMatch = rawPath.match(/^([^?#]+)([?#].*)?$/);
	const basePath = pathMatch?.[1] ?? rawPath;
	const suffix = pathMatch?.[2] ?? "";

	const safeSegments = basePath
		.split("/")
		.filter((segment) => segment.length > 0 && segment !== "." && segment !== "..")
		.map((segment) => encodeURIComponent(segment));

	if (safeSegments.length === 0) {
		return null;
	}

	return `${safeSegments.join("/")}${suffix}`;
}

function resolveAssetUrl(rawUrl: string, context: MarkdownContext, kind: "link" | "image"): string | null {
	const trimmed = rawUrl.trim();
	if (!trimmed) {
		return null;
	}

	if (trimmed.startsWith("#") && kind === "link") {
		return trimmed;
	}

	if (trimmed.startsWith("/")) {
		return trimmed;
	}

	const absoluteUrl = sanitizeAbsoluteUrl(trimmed, kind);
	if (absoluteUrl) {
		return absoluteUrl;
	}

	const normalizedPath = normalizeRelativePath(trimmed);
	if (!normalizedPath) {
		return null;
	}

	return `/blog/${encodeURIComponent(context.slug)}/${normalizedPath}`;
}

function renderInlineMarkdown(content: string, context: MarkdownContext): string {
	const placeholders = new Map<string, string>();
	let placeholderIndex = 0;
	const reserve = (html: string) => {
		const key = `%%INLINE_${placeholderIndex++}%%`;
		placeholders.set(key, html);
		return key;
	};

	let workingContent = content;

	workingContent = workingContent.replace(/`([^`]+?)`/g, (_fullMatch, code: string) =>
		reserve(`<code>${escapeHtml(code)}</code>`),
	);

	workingContent = workingContent.replace(
		/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
		(_fullMatch, altText: string, rawUrl: string, title: string | undefined) => {
			const resolvedUrl = resolveAssetUrl(rawUrl, context, "image");
			if (!resolvedUrl) {
				return "";
			}

			const escapedAlt = escapeHtml(altText);
			const escapedUrl = escapeHtml(resolvedUrl);
			const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";

			return reserve(
				`<img src="${escapedUrl}" alt="${escapedAlt}" loading="lazy" decoding="async"${titleAttribute} />`,
			);
		},
	);

	workingContent = workingContent.replace(
		/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
		(_fullMatch, label: string, rawUrl: string, title: string | undefined) => {
			const resolvedUrl = resolveAssetUrl(rawUrl, context, "link");
			if (!resolvedUrl) {
				return escapeHtml(label);
			}

			const escapedUrl = escapeHtml(resolvedUrl);
			const escapedLabel = escapeHtml(label);
			const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
			const isExternal = /^https?:\/\//i.test(resolvedUrl);
			const relAttribute = isExternal ? ` rel="noopener noreferrer nofollow"` : "";
			const targetAttribute = isExternal ? ` target="_blank"` : "";

			return reserve(
				`<a href="${escapedUrl}"${titleAttribute}${targetAttribute}${relAttribute}>${escapedLabel}</a>`,
			);
		},
	);

	workingContent = escapeHtml(workingContent);
	workingContent = workingContent
		.replace(/(\*\*|__)(.+?)\1/g, "<strong>$2</strong>")
		.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>")
		.replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1<em>$2</em>")
		.replace(/~~(.+?)~~/g, "<del>$1</del>");

	for (const [placeholder, html] of placeholders.entries()) {
		workingContent = workingContent.replaceAll(placeholder, html);
	}

	return workingContent;
}

function renderMarkdownToHtml(markdown: string, context: MarkdownContext): string {
	const lines = markdown.replace(/\r\n/g, "\n").split("\n");
	const htmlChunks: string[] = [];

	let paragraphLines: string[] = [];
	let quoteLines: string[] = [];
	let listType: "ul" | "ol" | null = null;
	let listItems: string[] = [];
	let inCodeBlock = false;
	let codeLanguage = "";
	let codeLines: string[] = [];

	const flushParagraph = () => {
		if (paragraphLines.length === 0) {
			return;
		}

		const paragraphContent = paragraphLines.join(" ").trim();
		paragraphLines = [];
		if (!paragraphContent) {
			return;
		}

		htmlChunks.push(`<p>${renderInlineMarkdown(paragraphContent, context)}</p>`);
	};

	const flushQuote = () => {
		if (quoteLines.length === 0) {
			return;
		}

		const quoteContent = quoteLines.join(" ").trim();
		quoteLines = [];
		if (!quoteContent) {
			return;
		}

		htmlChunks.push(`<blockquote><p>${renderInlineMarkdown(quoteContent, context)}</p></blockquote>`);
	};

	const flushList = () => {
		if (!listType || listItems.length === 0) {
			listType = null;
			listItems = [];
			return;
		}

		const listMarkup = listItems.map((item) => `<li>${item}</li>`).join("");
		htmlChunks.push(`<${listType}>${listMarkup}</${listType}>`);
		listType = null;
		listItems = [];
	};

	const flushCode = () => {
		if (!inCodeBlock) {
			return;
		}

		const escapedCode = escapeHtml(codeLines.join("\n"));
		const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : "";
		htmlChunks.push(`<pre><code${languageClass}>${escapedCode}</code></pre>`);
		inCodeBlock = false;
		codeLanguage = "";
		codeLines = [];
	};

	for (const line of lines) {
		const trimmed = line.trim();

		if (inCodeBlock) {
			if (trimmed.startsWith("```")) {
				flushCode();
				continue;
			}

			codeLines.push(line);
			continue;
		}

		if (trimmed.startsWith("```")) {
			flushParagraph();
			flushQuote();
			flushList();
			inCodeBlock = true;
			codeLanguage = trimmed.replace(/^```/, "").trim().split(/\s+/)[0] ?? "";
			codeLines = [];
			continue;
		}

		if (!trimmed) {
			flushParagraph();
			flushQuote();
			flushList();
			continue;
		}

		const quoteMatch = trimmed.match(/^>\s?(.*)$/);
		if (quoteMatch) {
			flushParagraph();
			flushList();
			quoteLines.push(quoteMatch[1]);
			continue;
		}
		flushQuote();

		const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			flushParagraph();
			flushList();
			const level = headingMatch[1].length;
			const headingContent = renderInlineMarkdown(headingMatch[2], context);
			htmlChunks.push(`<h${level}>${headingContent}</h${level}>`);
			continue;
		}

		if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
			flushParagraph();
			flushList();
			htmlChunks.push("<hr />");
			continue;
		}

		const unorderedItem = trimmed.match(/^[-*+]\s+(.+)$/);
		const orderedItem = trimmed.match(/^\d+\.\s+(.+)$/);
		if (unorderedItem || orderedItem) {
			flushParagraph();
			const nextListType = unorderedItem ? "ul" : "ol";
			if (listType && listType !== nextListType) {
				flushList();
			}

			listType = nextListType;
			listItems.push(renderInlineMarkdown((unorderedItem ?? orderedItem)?.[1] ?? "", context));
			continue;
		}
		flushList();

		paragraphLines.push(trimmed);
	}

	flushParagraph();
	flushQuote();
	flushList();
	flushCode();

	return htmlChunks.join("\n");
}

export function getBlogPath(language: BlogLanguage, slug: string): string {
	const normalizedSlug = slugify(slug);
	return `${BLOG_PATH_BY_LANGUAGE[language]}/${normalizedSlug}`;
}

export function getAbsoluteBlogPath(language: BlogLanguage, slug: string): string {
	return `${SITE_URL}${getBlogPath(language, slug)}`;
}

function normalizeCanonicalUrl(value: string | undefined, language: BlogLanguage, slug: string): string {
	if (!value) {
		return getAbsoluteBlogPath(language, slug);
	}

	const trimmedValue = value.trim();
	if (!trimmedValue) {
		return getAbsoluteBlogPath(language, slug);
	}

	if (trimmedValue.startsWith("/")) {
		return `${SITE_URL}${trimmedValue}`;
	}

	const absolute = sanitizeAbsoluteUrl(trimmedValue, "canonical");
	return absolute ?? getAbsoluteBlogPath(language, slug);
}

async function parseFileToPost(fileName: string): Promise<ParsedBlogPost> {
	const absolutePath = path.join(BLOG_DIR, fileName);
	const [rawContent, stats] = await Promise.all([fs.readFile(absolutePath, "utf8"), fs.stat(absolutePath)]);
	const { frontmatter, body } = parseFrontmatter(rawContent);

	const fileIdentity = parseFileIdentity(fileName);
	const language = parseLanguage(frontmatter.lang, fileIdentity.fileLanguage);
	const slug = normalizeSlug(frontmatter.slug, fileIdentity.baseName || fileName);
	const translationKey = normalizeTranslationKey(frontmatter.translationKey, fileIdentity.baseName || slug, slug);
	const title = frontmatter.title?.trim() || titleFromSlug(slug);
	const publishedAt = parseDate(frontmatter.date, stats.birthtime || stats.mtime);
	const updatedAt = parseDate(frontmatter.updated, stats.mtime);
	const excerpt = frontmatter.excerpt?.trim() || createExcerpt(body);
	const tags = parseTags(frontmatter.tags);
	const coverImage = frontmatter.coverImage
		? resolveAssetUrl(frontmatter.coverImage, { slug }, "image")
		: null;
	const coverAlt = frontmatter.coverAlt?.trim() || null;
	const seoTitle = frontmatter.seoTitle?.trim() || null;
	const seoDescription = frontmatter.seoDescription?.trim() || null;
	const canonicalUrl = normalizeCanonicalUrl(frontmatter.canonicalUrl, language, slug);
	const readingTimeMinutes = estimateReadingTime(body);
	const contentHtml = renderMarkdownToHtml(body, { slug });
	const draft = parseBoolean(frontmatter.draft);

	return {
		draft,
		language,
		translationKey,
		slug,
		title,
		excerpt,
		publishedAt,
		updatedAt,
		tags,
		coverImage,
		coverAlt,
		seoTitle,
		seoDescription,
		canonicalUrl,
		readingTimeMinutes,
		contentMarkdown: body,
		contentHtml,
	};
}

const loadAllPosts = cache(async (): Promise<ParsedBlogPost[]> => {
	try {
		const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
		const markdownFiles = entries
			.filter((entry) => entry.isFile())
			.map((entry) => entry.name)
			.filter((fileName) => SUPPORTED_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
			.filter((fileName) => !fileName.startsWith("_"))
			.filter((fileName) => fileName.toLowerCase() !== "readme.md");

		const posts = await Promise.all(markdownFiles.map((fileName) => parseFileToPost(fileName)));

		posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
		return posts;
	} catch (error) {
		const isMissingBlogDir = (error as NodeJS.ErrnoException).code === "ENOENT";
		if (isMissingBlogDir) {
			return [];
		}

		throw error;
	}
});

function toSummary(post: ParsedBlogPost): BlogPostSummary {
	return {
		language: post.language,
		translationKey: post.translationKey,
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		publishedAt: post.publishedAt,
		updatedAt: post.updatedAt,
		tags: post.tags,
		coverImage: post.coverImage,
		coverAlt: post.coverAlt,
		seoTitle: post.seoTitle,
		seoDescription: post.seoDescription,
		canonicalUrl: post.canonicalUrl,
		readingTimeMinutes: post.readingTimeMinutes,
	};
}

function toPost(post: ParsedBlogPost): BlogPost {
	return {
		language: post.language,
		translationKey: post.translationKey,
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		publishedAt: post.publishedAt,
		updatedAt: post.updatedAt,
		tags: post.tags,
		coverImage: post.coverImage,
		coverAlt: post.coverAlt,
		seoTitle: post.seoTitle,
		seoDescription: post.seoDescription,
		canonicalUrl: post.canonicalUrl,
		readingTimeMinutes: post.readingTimeMinutes,
		contentMarkdown: post.contentMarkdown,
		contentHtml: post.contentHtml,
	};
}

export const getAllBlogPosts = cache(async (language: BlogLanguage): Promise<BlogPostSummary[]> => {
	const posts = await loadAllPosts();
	return posts
		.filter((post) => !post.draft && post.language === language)
		.map((post) => toSummary(post));
});

export const getBlogPostBySlug = cache(async (language: BlogLanguage, slug: string): Promise<BlogPost | null> => {
	const normalizedSlug = slugify(slug);
	const posts = await loadAllPosts();
	const post = posts.find(
		(candidate) => candidate.language === language && candidate.slug === normalizedSlug && !candidate.draft,
	);
	return post ? toPost(post) : null;
});

export const getBlogPostAlternates = cache(
	async (language: BlogLanguage, slug: string): Promise<Partial<Record<BlogLanguage, string>> | null> => {
		const normalizedSlug = slugify(slug);
		const posts = await loadAllPosts();
		const post = posts.find(
			(candidate) => candidate.language === language && candidate.slug === normalizedSlug && !candidate.draft,
		);
		if (!post) {
			return null;
		}

		const translations = posts.filter(
			(candidate) => candidate.translationKey === post.translationKey && !candidate.draft,
		);
		const alternates: Partial<Record<BlogLanguage, string>> = {};

		for (const translation of translations) {
			alternates[translation.language] = getBlogPath(translation.language, translation.slug);
		}

		return alternates;
	},
);

export function formatBlogDate(dateIsoString: string, language: BlogLanguage = "pl"): string {
	const locale = language === "pl" ? "pl-PL" : "en-US";

	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(dateIsoString));
}
