# Blog Content Contract (OpenClaw)

This folder is the publishing input for the website blog engine.

## Required file naming

- Polish post: `<slug>.pl.md`
- English post: `<slug>.en.md`

Example:

- `openclaw-vps-akash-testnet.pl.md`
- `openclaw-vps-akash-testnet.en.md`

## Required frontmatter

```md
---
title: "..."
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
excerpt: "..."
tags: "tag-one, tag-two"
seoTitle: "..."
seoDescription: "..."
slug: "same-slug-for-both-languages"
lang: "pl" or "en"
translationKey: "same-key-for-both-languages"
draft: true or false
---
```

Notes:

- Keep `slug` and `translationKey` identical for PL/EN pair.
- `draft: true` means hidden from blog pages and sitemap.
- `draft: false` means public.

## Image convention

- Store media in `public/blog/<slug>/`
- Use absolute paths in markdown: `/blog/<slug>/image.webp`

## Recommended OpenClaw workflow

1. Generate both files (`.pl.md` + `.en.md`) with `draft: true`.
2. Open pull request.
3. Manual review/approval.
4. Set `draft: false` and merge.

