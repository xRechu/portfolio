import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopControls from "@/components/TopControls";
import { formatBlogDate, getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import styles from "../blog.module.css";

const SITE_URL = "https://jakubreszka.pl";

type BlogPostPageProps = {
	params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

function toAbsoluteUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) {
		return url;
	}

	return `${SITE_URL}${url}`;
}

export async function generateStaticParams() {
	const posts = await getAllBlogPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		return {
			title: "Wpis nie znaleziony",
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const seoTitle = post.seoTitle ?? post.title;
	const seoDescription = post.seoDescription ?? post.excerpt;
	const coverImageUrl = post.coverImage ? toAbsoluteUrl(post.coverImage) : null;

	return {
		title: seoTitle,
		description: seoDescription,
		keywords: post.tags.length > 0 ? post.tags : undefined,
		alternates: {
			canonical: post.canonicalUrl,
		},
		openGraph: {
			type: "article",
			url: post.canonicalUrl,
			title: seoTitle,
			description: seoDescription,
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			tags: post.tags,
			authors: ["Jakub Reszka"],
			images: coverImageUrl
				? [
						{
							url: coverImageUrl,
							alt: post.coverAlt ?? post.title,
						},
					]
				: undefined,
		},
		twitter: {
			card: coverImageUrl ? "summary_large_image" : "summary",
			title: seoTitle,
			description: seoDescription,
			images: coverImageUrl ? [coverImageUrl] : undefined,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.seoDescription ?? post.excerpt,
		datePublished: post.publishedAt,
		dateModified: post.updatedAt,
		mainEntityOfPage: post.canonicalUrl,
		author: {
			"@type": "Person",
			name: "Jakub Reszka",
			url: SITE_URL,
		},
		publisher: {
			"@type": "Person",
			name: "Jakub Reszka",
		},
		image: post.coverImage ? [toAbsoluteUrl(post.coverImage)] : undefined,
		keywords: post.tags.join(", "),
	};

	return (
		<main className={styles.blogPage}>
			<a href="/" className="brand-wordmark" aria-label="Wroc do strony glownej">
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>
			<TopControls />

			<div className={`${styles.blogInner} ${styles.articleInner}`}>
				<Link href="/blog" className={styles.blogBackLink}>
					Wroc do listy wpisow
				</Link>

				<article className={styles.blogArticle}>
					<header className={styles.articleHeader}>
						<p className={styles.articleMeta}>
							{formatBlogDate(post.publishedAt)} · {post.readingTimeMinutes} min czytania
						</p>
						<h1 className={styles.blogTitle}>{post.title}</h1>
						{post.tags.length > 0 ? (
							<div className={styles.postTags}>
								{post.tags.map((tag) => (
									<span key={`${post.slug}-${tag}`} className={styles.postTag}>
										{tag}
									</span>
								))}
							</div>
						) : null}
					</header>

					{post.coverImage ? (
						<img
							src={post.coverImage}
							alt={post.coverAlt ?? post.title}
							className={styles.coverImage}
							loading="eager"
							decoding="async"
						/>
					) : null}

					<div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
				</article>
			</div>

			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
		</main>
	);
}

