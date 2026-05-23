# mo-install-guide

A per-OS, per-database installation reference site for **miniOrange On-Premise IDP 5.0.0**, built with Astro.

## What this is

Pick a Linux distribution, pick a database backend, get the exact commands to run. Each OS page covers system prep, the four supported databases (PostgreSQL, MySQL, MSSQL, Oracle), Erlang/RabbitMQ, the `mo-installer` flow, and verification.

The four DB sections per OS swap in place via a tab control with URL query state (`?db=mssql`) and `localStorage` persistence, so a printed runbook or a shared link both work.



## Scope (all 21 distributions shipped)

**Source-fidelity anchors** (highest confidence, take what's here as the reference for the family):

- Oracle Linux 8 + Oracle 19c → traces verbatim to the v5.0.0 deployment guide
- RHEL 9 + PostgreSQL → matches the v5.0.0 generic Linux guide

**Tier 1 — full content, all four DBs:**

| Family                  | Versions shipped                                                                 |
|-------------------------|----------------------------------------------------------------------------------|
| RHEL / Oracle Linux     | RHEL 8, RHEL 9, Oracle Linux 8, Oracle Linux 9                                  |
| Rebuilds                | Rocky 8/9, AlmaLinux 8/9, CentOS Stream 9                                       |
| Debian family           | Ubuntu 20.04, Ubuntu 22.04, Ubuntu 24.04, Debian 11, Debian 12                  |
| SUSE                    | SLES 15                                                                          |
| Cloud                   | Amazon Linux 2, Amazon Linux 2023                                                |

**Tier 2 — Alpine (OpenRC, musl):**

- Alpine 3.18, 3.19, 3.20, 3.21 (MSSQL and Oracle unsupported by their vendors; Postgres and MySQL covered via Alpine's apk packages)

**Confidence levels per cell** are encoded as the five-status badge in the registry (Verified, Derived, Partial, Unverified, Unsupported). See `VERIFICATION.md` for the cell-level rationale and the `/verification` page in the running site for the live matrix.

## Stack

- **Astro 4.16** (static site)
- **Tailwind 3.4** (no preflight reset, custom token system)
- **MDX** support via `@astrojs/mdx`
- **Newsreader** (display) + **IBM Plex Sans** (body) + **JetBrains Mono** (code) via Google Fonts
- No client framework, just Astro components + vanilla JS for interactivity (~3KB of behaviour)

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open http://localhost:4321 .

## Production build

```bash
npm run build
npm run preview
```

The static output lands in `dist/`. Drop it on any static host (S3, Cloudflare Pages, Nginx, GitHub Pages).

## Project layout

```
mo-install-guide/
├── astro.config.mjs           # Astro + Tailwind + MDX integration
├── tailwind.config.mjs        # Custom fonts + color tokens
├── src/
│   ├── data/
│   │   └── os-registry.ts     # Single source of truth: every OS and DB-support cell
│   ├── content/
│   │   └── os/<slug>/         # Markdown content per OS
│   │       ├── system-prep.md
│   │       ├── db-postgres.md
│   │       ├── db-mysql.md
│   │       ├── db-mssql.md
│   │       ├── db-oracle.md
│   │       ├── erlang-rabbitmq.md
│   │       ├── mo-installer.md
│   │       └── verify.md
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── OSCard.astro       # Homepage card
│   │   └── StatusBadge.astro
│   ├── pages/
│   │   ├── index.astro        # Homepage with search + category filters
│   │   ├── verification.astro # Matrix report
│   │   └── os/[slug].astro    # OS detail page with DB selector + TOC + copy buttons
│   └── styles/global.css
└── public/
    └── favicon.svg
```

## How content is wired

- `src/data/os-registry.ts` lists every OS and the `verified` | `derived` | `partial` | `unverified` | `unsupported` status per DB. The homepage cards, the `/verification` matrix, the per-OS DB tiles, and the auto-rendered callout banners all read from this file.
- `src/pages/os/[slug].astro` calls `getStaticPaths()` against `OSES.filter(o => o.built)`, so only OSes with a content directory are rendered. Adding `built: false` keeps a row visible on the homepage with a "Coming soon" badge but no link.
- Markdown content is imported via `import.meta.glob('../../content/os/**/*.md', { eager: true })` at build time. Each filename is mapped to a content slot (`system-prep`, `db-postgres`, `db-mysql`, etc.).

## Adding a new OS

1. Add an entry to `OSES` in `src/data/os-registry.ts` with `built: true`. Pick the right `category` (`enterprise`, `rebuild`, `cloud`, `container`), `packageManager`, `initSystem`, and per-DB status objects.
2. Create `src/content/os/<slug>/` with the eight required files: `system-prep.md`, `db-postgres.md`, `db-mysql.md`, `db-mssql.md`, `db-oracle.md`, `erlang-rabbitmq.md`, `mo-installer.md`, `verify.md`.
3. Run `npm run dev`. The OS appears on the homepage and at `/os/<slug>`.

If a DB combination is unsupported on the new OS, set its `status` to `unsupported` in the registry. The DB tile in the UI will be disabled, the callout banner will render automatically, and the file can be a one-paragraph stub explaining the gap.

## Adding a new database backend

This is heavier. You need to:

1. Extend the `DBSupport` and `DBStatus` types in `src/data/os-registry.ts`.
2. Add the new DB key to `dbMeta` in `src/pages/os/[slug].astro`.
3. Add `db-<newdb>.md` files to every built OS directory.
4. Update the `/verification` table headers.

Realistically, the four shipped DBs cover the v5.0.0 supported matrix, so a new DB is unlikely.

## Editing styling and theme

- All color tokens are CSS variables in `src/styles/global.css`. Light and dark mode are full token sets keyed off `.dark` on `<html>`.
- Tailwind utility classes are scoped to `src/**/*.{astro,html,md,mdx}` (see `tailwind.config.mjs`). Custom fonts and palette extensions are in the same config.
- Code blocks use Shiki themes `github-light` and `github-dark-dimmed` configured in `astro.config.mjs`. Inline `code` uses the `--kbd-bg` token; `pre` blocks override to a darker `--code-bg` for contrast in light mode.

## What's intentionally not here

- No client-side JS framework. The DB tile selector, search filter, theme toggle, copy buttons, and active-TOC highlight are vanilla JS inside `<script is:inline>` blocks.
- No `localStorage` for the active DB on first visit; the choice persists across visits to the same OS but defaults to `postgres` on a fresh visit.
- No analytics, no telemetry, no third-party fonts beyond Google Fonts.
- No Astro Content Collections schema; markdown is loaded via `import.meta.glob` for transparency. Switching to Content Collections later is straightforward.

## Verification policy

Every command on a "Verified" page either appears verbatim in the v5.0.0 source guides (PostgreSQL on RHEL family, Oracle 19c on Oracle Linux 8), or is an unambiguous translation of a `dnf` step into the platform's package manager.

Commands on "Derived" pages (MySQL on any OS, MSSQL on any OS) are built from the vendor's published install steps plus the JDBC-driver-in-`/opt/miniorange/drivers/` convention from the Oracle source flow. They should work but should be sanity-checked before production rollout. The callout banner on each Derived section states this explicitly.

Commands on "Partial" pages (Oracle on Ubuntu/Debian) describe a non-source-supported path that nonetheless works in practice (Instant Client + remote DB host).

## License

Internal miniOrange documentation. Source guides are property of miniOrange Security Software Pvt. Ltd.
