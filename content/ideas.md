# Editorial backlog: "Notes from the Grassfields"

> Private. Not rendered on the site. This is my running catalog of post ideas
> about the Cameroonian (and broader African) developer experience.
> Status: `[ ]` idea · `[~]` drafting · `[x]` published.
>
> When a reader submission (via /share) fits a theme, drop a note under it.

## How a post works (frontmatter)

Every post is an `.mdx` file in `content/blog/`. The block at the top controls
everything. To put a post in a series, set `series` and `order`:

```yaml
---
title: "The post title"
date: "2026-06-26"          # newest sorts first on the blog index
summary: "One or two sentences shown on the card and in search."
tags: ["cameroon", "payments"]   # become clickable tag pages
series: "Notes from the Grassfields"   # optional, groups posts
order: 3                    # optional, position within the series
---
```

- Reuse the exact same `series` string to add a post to an existing series. A
  new string creates a new series automatically (with its own /blog/series page).
- `order` sets reading order inside a series; without it, posts fall back to date.
- Reading time and the table of contents are generated automatically.
- Current series: **Notes from the Grassfields** (the Cameroon story) and
  **Engineering** (the build/craft posts).

## Published

- [x] **Building software from Cameroon: the part of the job nobody warns you about** — flagship overview (series). `content/blog/building-software-from-cameroon.mdx`
- [x] **How Cameroonian developers actually get paid** — payments deep dive (series). `content/blog/how-cameroonian-developers-get-paid.mdx`
- [x] **The exactly-once lie: idempotency keys** — engineering. `content/blog/idempotency-keys-payment-integrations.mdx`
- [x] **Maayo: building an offline-first sync library** — engineering. `content/blog/maayo-offline-first-sync-library.mdx`
- [x] **How Serena made Claude Code usable in a 100-microservice codebase** — engineering. `content/blog/serena-claude-code-large-codebase.mdx`
- [x] **Eight teams, three days, one demo day: the Bamenda Community Challenge** — series, ecosystem win. `content/blog/bamenda-community-challenge.mdx`
- [x] **Barme: a lightweight content-addressed object store in Rust** — engineering, project release. `content/blog/barme-content-addressed-object-store.mdx`

## Engineering / things I build (general dev blog)

> Not part of the Cameroon series — just the work. Tag these `engineering`.

- [ ] Kafka vs. RabbitMQ: how I actually choose between them (and when I run both).
- [ ] The outbox pattern: publishing events without losing them or double-sending.
- [ ] Designing a microservice boundary you won't hate in six months.
- [ ] Observability that earns its keep — the Grafana dashboards I actually look at.
- [ ] CI/CD that fails fast: trimming a slow GitLab/Azure pipeline.
- [ ] Kotlin features I'd miss most if I went back to Java.
- [ ] Database migrations on a live table without downtime.
- [ ] What leading a team taught me that no amount of solo coding could.
- [ ] A teardown of a real bug I shipped (and what the post-mortem changed).

## Payments & money

- [ ] The real cost of a $100 invoice — track one payment from client to MoMo, every fee along the way.
- [ ] Stablecoins for African freelancers: hype vs. reality (USDT/USDC, on/off-ramps, risk).
- [ ] Mobile Money (MTN MoMo, Orange Money) as a developer's primary rail — what it can and can't do.
- [ ] Setting up Payoneer / Wise from Cameroon: a step-by-step that actually works in 2026.

## The ridicule / credibility tax

- [ ] "Where are you based?" — the moment a rate gets cut in half, and how to handle it.
- [ ] Imposter syndrome vs. structural doubt: they are not the same thing.
- [ ] Building a portfolio that pre-empts the doubt (proof over promises).

## Infrastructure

- [ ] 230 days offline: what the 2017–2018 Anglophone internet shutdown did to Silicon Mountain. (Sources: TechCabal, Quartz Africa, Wikipedia "Silicon Mountain".)
- [ ] Designing your workflow for unreliable power and internet (offline-first, generators, mobile tethering, cached deps).
- [ ] The "internet refugee camp" in Bonako — devs who relocated to keep working.

## Opportunity & ecosystem

- [ ] Silicon Mountain, Buea: history, the GDG roots (2013), the Silicon Mountain Conference (2015).
- [ ] Breaking into remote work from Cameroon: the first international client.
- [ ] Outreachy / open source as a launchpad (my OpenRefine story).
- [ ] Brain drain vs. building locally — why I stay (or the case for both).
- [ ] Francophone vs. Anglophone tech divide and what it means for opportunity.

## Craft / career

- [ ] Mentoring juniors when there's no senior to mentor *you*.
- [ ] From University of Bamenda to Technical Lead: the non-linear path.

## Reader submissions to weave in
<!-- Paste/anonymize good submissions here under the matching theme. -->
- (none yet)

## Sources worth re-citing
- TechCabal — "Cameroon's Silicon Mountain: Its History, Resilience and Future" (2018)
- Quartz Africa — internet shutdown coverage (2017): 230 days offline, ~$4.5M cost, Orange −20% revenue
- Wikipedia — "Silicon Mountain"
- Stripe / PayPal country support docs; Paystack "Extended Network" (payouts not supported)
- African freelancer payment guides (Wise, Payoneer, stablecoins)
