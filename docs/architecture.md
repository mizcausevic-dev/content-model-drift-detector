# Architecture

## Overview

`content-model-drift-detector` is a TypeScript and Express application that turns CMS schema change into a reviewable platform-reliability surface.

The repo models three layers:

1. **content model contracts**
   - WordPress and WPGraphQL-facing schema snapshots
   - editorial ownership, template binding, and publish cadence
   - field-level status for stable, changed, missing, and orphaned shape

2. **consumer contracts**
   - downstream surfaces such as marketing web, docs, search, and AI answer packaging
   - validation lag, fragile field dependencies, and model ownership views

3. **drift decisioning**
   - summary scoring for model coverage and consumer staleness
   - breaking and watch-level issue queues
   - recommendation text that can be used by release, content, or platform teams

## Runtime shape

- `src/data/sampleModels.ts`
  - sample contract state used by the app
- `src/services/driftService.ts`
  - summary, issue ranking, and contract transformation logic
- `src/services/render.ts`
  - HTML control surfaces for operator review
- `src/app.ts`
  - Express routes for HTML and JSON outputs

## Primary routes

- `/`
  - overview and lead recommendation
- `/drift-board`
  - breaking and watch-level issue queue
- `/models`
  - model contract table
- `/consumers`
  - downstream consumer drift posture
- `/verification`
  - top-line proof summary
- `/docs`
  - route and payload map

## Validation approach

- `vitest`
  - verifies the scoring and contract transformation logic
- `scripts/run_demo.ts`
  - renders a deterministic JSON snapshot of the current drift posture
- `scripts/smoke_check.ts`
  - boots the app and confirms that core HTML and JSON routes respond correctly
- `scripts/render_readme_assets.ps1`
  - captures real browser screenshots from the running app for README proof
