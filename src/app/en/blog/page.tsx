import type { Metadata } from "next";
import Link from "next/link";
import TopControls from "@/components/TopControls";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import styles from "../../blog/blog.module.css";

const BLOG_SEO_TITLE = "Blog";
const BLOG_SEO_DESCRIPTION =
	"Case studies and practical notes about Next.js, AI automation, VPS and e-commerce implementations.";

export const dynamic = "force-static";

export const metadata: Metadata = {
	title: BLOG_SEO_TITLE,
	description: BLOG_SEO_DESCRIPTION,
	alternates: {
		canonical: "/en/blog",
		languages: {
			"pl-PL": "/blog",
			"en-US": "/en/blog",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://jakubreszka.pl/en/blog",
		title: "Blog | Jakub Reszka",
		description: BLOG_SEO_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: BLOG_SEO_TITLE,
		description: BLOG_SEO_DESCRIPTION,
	},
};

export default async function EnglishBlogIndexPage() {
	const posts = await getAllBlogPosts("en");

	return (
		<main className={styles.blogPage}>
			<a href="/en" className="brand-wordmark" aria-label="Go back to homepage">
				<span className="brand-wordmark-name">JAKUB RESZKA</span>
				<span className="brand-wordmark-role">Next.js · E-commerce · AI</span>
			</a>
			<TopControls />

			<div className={styles.blogInner}>
				<Link href="/en" className={styles.blogBackLink}>
					Back to homepage
				</Link>

				<header className={styles.blogHeader}>
					<p className={styles.blogEyebrow}>Blog</p>
					<h1 className={styles.blogTitle}>Posts published automatically from Markdown</h1>
					<p className={styles.blogDescription}>
						Each post uses the same template and SEO rules. OpenClaw can drop finished files into{" "}
						<code>/blog</code>, and the site builds a ready article.
					</p>
					<Link href="/blog" className={styles.languageSwitchLink}>
						Zobacz polska wersje
					</Link>
				</header>

				{posts.length > 0 ? (
					<section className={styles.postGrid} aria-label="Blog posts list">
						{posts.map((post) => (
							<article key={post.slug} className={styles.postCard}>
								<p className={styles.postMeta}>
									{formatBlogDate(post.publishedAt, "en")} · {post.readingTimeMinutes} min read
								</p>
								<h2 className={styles.postTitle}>{post.title}</h2>
								<p className={styles.postExcerpt}>{post.excerpt}</p>
								{post.tags.length > 0 ? (
									<div className={styles.postTags} aria-label="Post tags">
										{post.tags.map((tag) => (
											<span key={`${post.slug}-${tag}`} className={styles.postTag}>
												{tag}
											</span>
										))}
									</div>
								) : null}
								<Link href={`/en/blog/${post.slug}`} className={styles.postLink}>
									Read post
								</Link>
							</article>
						))}
					</section>
				) : (
					<section className={styles.emptyState}>
						No published posts yet. Add a <code>.md</code> file to <code>/blog</code> and set{" "}
						<code>draft: false</code>.
					</section>
				)}
			</div>
		</main>
	);
}
