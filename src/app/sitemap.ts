import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

const SITE_URL = "https://jakubreszka.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();
	const [plPosts, enPosts] = await Promise.all([getAllBlogPosts("pl"), getAllBlogPosts("en")]);

	const baseRoutes: MetadataRoute.Sitemap = [
		{
			url: `${SITE_URL}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/blog`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/en`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.95,
		},
		{
			url: `${SITE_URL}/en/blog`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/polityka-prywatnosci`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${SITE_URL}/en/polityka-prywatnosci`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${SITE_URL}/regulamin`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${SITE_URL}/en/regulamin`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.3,
		},
	];

	const blogPostRoutes: MetadataRoute.Sitemap = [
		...plPosts.map((post) => ({
			url: `${SITE_URL}/blog/${post.slug}`,
			lastModified: new Date(post.updatedAt),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
		...enPosts.map((post) => ({
			url: `${SITE_URL}/en/blog/${post.slug}`,
			lastModified: new Date(post.updatedAt),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];

	return [...baseRoutes, ...blogPostRoutes];
}
