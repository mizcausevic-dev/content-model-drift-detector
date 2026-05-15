# Changelog

All notable changes to this project are documented here.

## [1.0.0] - 2026-05-15

### Released
- Published **content-model-drift-detector** as a public TypeScript and Express control surface for detecting WordPress and headless content contract drift before publish or deploy.
- Packaged the current implementation, browser-rendered proof assets, validation flow, and docs into a repo that shows content-model reliability as an operator problem, not just a CMS inconvenience.
- Clarified the core problem the project is addressing: frontend contracts, WPGraphQL consumers, and answer surfaces break quietly when editorial schema changes outrun downstream validation.

### Why this mattered
- Most content tooling explains what changed in the CMS, but not what those changes are about to break downstream.
- Existing SEO, publishing, and preview workflows still leave a gap around model drift, stale field assumptions, and consumer validation lag.
- This release turns schema drift into a control-plane problem that platform, content, and frontend teams can review together.

## [0.1.0] - 2026-02-11

### Shipped
- Cut the first coherent internal version of the detector with model contracts, consumer mappings, and drift severity outputs.
- Anchored the repo around changed, missing, and orphaned field detection instead of generic CMS reporting.
- Established the control-surface shape used by the public version.

## [Prototype] - 2025-06-04

### Built
- Built the first runnable prototype against realistic WordPress and headless content scenarios.
- Tested the concept against the kinds of failures teams usually discover too late: renamed ACF fields, stale WPGraphQL assumptions, and answer-surface payload drift.
- Confirmed that a drift queue was more useful than another passive schema catalog.

## [Design Phase] - 2024-03-19

### Designed
- Framed the system around frontend contract protection rather than around CMS admin convenience.
- Chose examples that made sense for WordPress, search, documentation, and AI-answer publishing stacks.
- Defined the output as something platform and content teams could both act on quickly.

## [Idea Origin] - 2023-07-07

### Observed
- The original idea surfaced while looking at how content model changes were creating silent downstream breakage in headless stacks.
- The recurring pattern was not missing tooling, but missing translation between editorial change and operational risk.

## [Background Signals] - 2022-11-15

### Context
- Earlier platform and content-system work made one pattern obvious: schema drift becomes expensive when teams discover it through broken pages, broken search, or broken answer surfaces instead of through contract review.
- That pattern shaped the thinking behind this repo well before the public version existed.
