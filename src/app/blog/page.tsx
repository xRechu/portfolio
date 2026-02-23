import type { Metadata } from "next";
import Link from "next/link";
import TopControls from "@/components/TopControls";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import styles from "./blog.module.css";

const BLOG_SEO_TITLE = "Blog | Jakub Reszka";
const BLOG_SEO_DESCRIPTION =
	"Case studies i poradniki o wdrozeniach Next.js, automatyzacjach AI, VPS i e-commerce.";

export const dynamic = "force-static";

export const metadata: Metadata = {
	title: BLOG_SEO_TITLE,
	description: BLOG_SEO_DESCRIPTION,
	alternates: {
		canonical: "/blog",
	},
	openGraph: {
		type: "website",
		locale: "pl_PL",
		url: "https://jakubreszka.pl/blog",
		title: BLOG_SEO_TITLE,
		description: BLOG_SEO_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: BLOG_SEO_TITLE,
		description: BLOG_SEO_DESCRIPTION,
	},
};

export default async function BlogIndexPage() {
	const posts = await getAllBlogPosts();

	return (
		<main className={styles.blogPage}>
			<a href="/" className="brand-wordmark" aria-label="Wroc do strony glownej">
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>
			<TopControls />

			<div className={styles.blogInner}>
				<Link href="/" className={styles.blogBackLink}>
					Wroc do strony glownej
				</Link>

				<header className={styles.blogHeader}>
					<p className={styles.blogEyebrow}>Blog</p>
					<h1 className={styles.blogTitle}>Wpisy publikowane automatycznie z Markdown</h1>
					<p className={styles.blogDescription}>
						Kazdy wpis ma ten sam template i SEO. OpenClaw moze wrzucac gotowe pliki do folderu <code>/blog</code>, a
						ta strona wygeneruje gotowy artykul.
					</p>
				</header>

				{posts.length > 0 ? (
					<section className={styles.postGrid} aria-label="Lista wpisow">
						{posts.map((post) => (
							<article key={post.slug} className={styles.postCard}>
								<p className={styles.postMeta}>
									{formatBlogDate(post.publishedAt)} · {post.readingTimeMinutes} min czytania
								</p>
								<h2 className={styles.postTitle}>{post.title}</h2>
								<p className={styles.postExcerpt}>{post.excerpt}</p>
								{post.tags.length > 0 ? (
									<div className={styles.postTags} aria-label="Tagi wpisu">
										{post.tags.map((tag) => (
											<span key={`${post.slug}-${tag}`} className={styles.postTag}>
												{tag}
											</span>
										))}
									</div>
								) : null}
								<Link href={`/blog/${post.slug}`} className={styles.postLink}>
									Czytaj wpis
								</Link>
							</article>
						))}
					</section>
				) : (
					<section className={styles.emptyState}>
						Brak opublikowanych wpisow. Dodaj plik <code>.md</code> do katalogu <code>/blog</code> i ustaw
						<code>draft: false</code>.
					</section>
				)}
			</div>
		</main>
	);
}

