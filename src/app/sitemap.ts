import type { MetadataRoute } from "next";

const SITE_URL = "https://jakubreszka.pl";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	return [
		{
			url: `${SITE_URL}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/polityka-prywatnosci`,
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
	];
}
