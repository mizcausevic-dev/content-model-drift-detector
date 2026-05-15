import { consumers, issueBoard, models, summary } from "./driftService";

function pageShell(title: string, active: string, body: string) {
  const nav = [
    ["/", "Overview", "overview"],
    ["/drift-board", "Drift Board", "drift"],
    ["/models", "Models", "models"],
    ["/consumers", "Consumers", "consumers"],
    ["/verification", "Verification", "verification"],
    ["/docs", "Docs", "docs"]
  ] as const;

  const navLinks = nav
    .map(([href, label, key]) => `<a class="nav-link ${active === key ? "active" : ""}" href="${href}">${label}</a>`)
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        :root {
          color-scheme: dark;
          --page: #07111f;
          --panel: #0d182a;
          --panel-2: #122039;
          --line: rgba(255,255,255,0.08);
          --text: #f3f7ff;
          --muted: #98a9c4;
          --accent: #78c9ff;
          --accent-2: #6c63ff;
          --good: #41d89d;
          --watch: #f5c46b;
          --bad: #ff7d8d;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Inter, "Segoe UI", system-ui, sans-serif;
          color: var(--text);
          background:
            radial-gradient(circle at top left, rgba(120,201,255,0.12), transparent 22%),
            linear-gradient(180deg, #050b15 0%, #081221 100%);
        }
        a { color: inherit; text-decoration: none; }
        .shell { max-width: 1420px; margin: 0 auto; padding: 28px; }
        .topbar {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 18px 22px; background: rgba(8,15,27,0.78); border: 1px solid var(--line);
          border-radius: 24px; box-shadow: 0 22px 54px rgba(0,0,0,0.26);
          backdrop-filter: blur(18px);
        }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-mark {
          width: 46px; height: 46px; border-radius: 14px; display: grid; place-items: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: white; font-weight: 900; letter-spacing: 0.04em;
        }
        .brand-copy strong { display: block; font-size: 18px; }
        .brand-copy span { display: block; margin-top: 4px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
        .nav-row {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px;
        }
        .nav-link {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 12px 16px; border-radius: 999px; border: 1px solid var(--line);
          background: rgba(255,255,255,0.03); color: #b6c6de;
          font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
        }
        .nav-link.active {
          background: linear-gradient(135deg, #0f93c8, #6c63ff);
          color: white; border-color: rgba(255,255,255,0.12);
        }
        .hero {
          margin-top: 20px; padding: 28px; border-radius: 28px; border: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(11,21,38,0.95), rgba(8,15,27,0.94));
          box-shadow: 0 26px 58px rgba(0,0,0,0.28);
        }
        .eyebrow {
          color: var(--accent); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 800;
        }
        h1 {
          margin: 14px 0 12px; font-size: clamp(38px, 5vw, 68px); line-height: 0.95;
          letter-spacing: -0.05em; font-family: Georgia, "Times New Roman", serif;
        }
        .hero p {
          margin: 0; max-width: 920px; color: var(--muted); font-size: 18px; line-height: 1.6;
        }
        .callout {
          margin-top: 20px; padding: 18px 20px; border-radius: 18px;
          background: rgba(255,255,255,0.04); border: 1px solid var(--line);
        }
        .callout strong {
          display: block; color: var(--watch); font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.18em; margin-bottom: 8px;
        }
        .callout span { color: #e6eefb; font-size: 16px; line-height: 1.55; }
        .grid-4, .grid-2, .grid-1 {
          display: grid; gap: 18px; margin-top: 20px;
        }
        .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .grid-2 { grid-template-columns: 1.2fr 0.9fr; }
        .grid-1 { grid-template-columns: 1fr; }
        .card, .table-shell {
          background: rgba(10,18,32,0.9); border: 1px solid var(--line);
          border-radius: 24px; box-shadow: 0 22px 54px rgba(0,0,0,0.18);
        }
        .metric-card { padding: 20px; }
        .metric-card .label {
          color: #7588a6; font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; font-weight: 800;
        }
        .metric-card .value {
          margin-top: 12px; font-size: 40px; font-weight: 900; letter-spacing: -0.04em;
        }
        .metric-card p { margin: 12px 0 0; color: var(--muted); font-size: 14px; line-height: 1.5; }
        .section-card { padding: 22px; }
        .section-card h2 {
          margin: 12px 0 8px; font-size: 24px; letter-spacing: -0.03em; font-family: Georgia, "Times New Roman", serif;
        }
        .section-card p { margin: 0; color: var(--muted); line-height: 1.6; }
        .list-row {
          padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.06);
          display: grid; gap: 12px; grid-template-columns: minmax(0, 1.2fr) auto;
        }
        .list-row:first-of-type { border-top: none; }
        .list-row h3 { margin: 0; font-size: 20px; letter-spacing: -0.02em; }
        .list-row .meta { margin-top: 8px; color: var(--muted); font-size: 13px; line-height: 1.55; }
        .pill {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 8px 12px; border-radius: 999px; font-size: 10px; font-weight: 900;
          letter-spacing: 0.14em; text-transform: uppercase; min-width: 104px;
        }
        .pill.breaking { color: var(--bad); background: rgba(255,125,141,0.12); border: 1px solid rgba(255,125,141,0.16); }
        .pill.watch { color: var(--watch); background: rgba(245,196,107,0.12); border: 1px solid rgba(245,196,107,0.16); }
        .pill.healthy { color: var(--good); background: rgba(65,216,157,0.12); border: 1px solid rgba(65,216,157,0.16); }
        .signal-list {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px;
        }
        .signal {
          display: inline-flex; align-items: center; padding: 8px 10px; border-radius: 999px;
          background: rgba(120,201,255,0.08); color: var(--accent);
          font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 16px 18px; text-align: left; vertical-align: top; }
        thead th {
          color: #7387a6; font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        tbody tr + tr td { border-top: 1px solid rgba(255,255,255,0.06); }
        tbody td { color: #eaf2ff; font-size: 14px; line-height: 1.5; }
        .mono { font-family: "Cascadia Code", Consolas, monospace; }
        .footer {
          margin-top: 18px; color: #7f93b1; font-size: 12px; display: flex; justify-content: space-between; gap: 12px;
        }
        @media (max-width: 1180px) {
          .grid-4, .grid-2 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 840px) {
          .grid-4, .grid-2 { grid-template-columns: 1fr; }
          .topbar { display: block; }
        }
      </style>
    </head>
    <body>
      <main class="shell">
        <section class="topbar">
          <div class="brand">
            <div class="brand-mark">CM</div>
            <div class="brand-copy">
              <strong>Content Model Drift Detector</strong>
              <span>WordPress + headless contract guardrail</span>
            </div>
          </div>
          <div class="nav-row">${navLinks}</div>
        </section>
        ${body}
        <div class="footer">
          <span>Contract snapshots for WordPress, WPGraphQL, ACF, and frontend consumers.</span>
          <span>Built to catch publish-time breakage before the site, search, or answer surfaces drift.</span>
        </div>
      </main>
    </body>
  </html>`;
}

export function renderOverview() {
  const stats = summary();
  return pageShell(
    "Content Model Drift Detector",
    "overview",
    `
      <section class="hero">
        <div class="eyebrow">Content model drift detector</div>
        <h1>Find schema breakage before content publish breaks the frontend.</h1>
        <p>WordPress and headless stacks drift when the editorial schema moves faster than the templates, GraphQL types, or downstream consumers relying on it. This repo turns that drift into a reviewable control surface.</p>
        <div class="callout">
          <strong>Lead recommendation</strong>
          <span>${stats.leadRecommendation}</span>
        </div>
      </section>
      <section class="grid-4">
        <article class="card metric-card"><div class="label">Models tracked</div><div class="value">${stats.modelCount}</div><p>Contracts currently under schema and consumer review.</p></article>
        <article class="card metric-card"><div class="label">Drifted models</div><div class="value">${stats.driftedModels}</div><p>Models currently carrying breaking or watch-level issues.</p></article>
        <article class="card metric-card"><div class="label">Breaking issues</div><div class="value">${stats.breakingCount}</div><p>Changes that should block publish or deploy until resolved.</p></article>
        <article class="card metric-card"><div class="label">Coverage</div><div class="value">${stats.contractCoverage}%</div><p>Fields currently modeled as stable across contracts.</p></article>
      </section>
      <section class="grid-2">
        <article class="card section-card">
          <div class="eyebrow">Priority drift</div>
          <h2>The issues most likely to break frontend delivery first.</h2>
          <p>These are the model and consumer mismatches worth addressing before the next editorial or deploy cycle.</p>
          ${issueBoard().slice(0, 3).map((issue) => `
            <div class="list-row">
              <div>
                <h3>${issue.title}</h3>
                <div class="meta">${issue.consumer} · ${issue.detail}</div>
                <div class="signal-list"><span class="signal">${issue.modelKey}</span><span class="signal">${issue.nextAction}</span></div>
              </div>
              <div><span class="pill ${issue.severity}">${issue.severity}</span></div>
            </div>
          `).join("")}
        </article>
        <article class="card section-card">
          <div class="eyebrow">Consumer fragility</div>
          <h2>Which downstream surfaces are furthest behind the CMS.</h2>
          <p>Validation lag and fragile field dependencies tell you which frontend or search surfaces are closest to contract breakage.</p>
          ${consumers().map((consumer) => `
            <div class="list-row">
              <div>
                <h3>${consumer.name}</h3>
                <div class="meta">${consumer.surface} · validation gap ${consumer.validationGapDays} days</div>
                <div class="signal-list">${consumer.fragileFields.map((field) => `<span class="signal">${field}</span>`).join("")}</div>
              </div>
              <div><span class="pill ${consumer.status}">${consumer.status}</span></div>
            </div>
          `).join("")}
        </article>
      </section>
    `
  );
}

export function renderDriftBoard() {
  return pageShell(
    "Content Model Drift Detector",
    "drift",
    `
      <section class="hero">
        <div class="eyebrow">Drift board</div>
        <h1>Review every content contract that’s drifting out of publish-safe territory.</h1>
        <p>This lane is for the exact changes that content systems teams, frontend engineers, and platform owners need to inspect before schema drift becomes a production bug.</p>
      </section>
      <section class="grid-1">
        <article class="card section-card">
          ${issueBoard().map((issue) => `
            <div class="list-row">
              <div>
                <h3>${issue.title}</h3>
                <div class="meta">${issue.modelKey} · ${issue.consumer}</div>
                <div class="meta">${issue.detail}</div>
                <div class="signal-list"><span class="signal">${issue.nextAction}</span></div>
              </div>
              <div><span class="pill ${issue.severity}">${issue.severity}</span></div>
            </div>
          `).join("")}
        </article>
      </section>
    `
  );
}

export function renderModels() {
  return pageShell(
    "Content Model Drift Detector",
    "models",
    `
      <section class="hero">
        <div class="eyebrow">Model board</div>
        <h1>Model-level contract snapshots for WordPress, WPGraphQL, and headless consumers.</h1>
        <p>Each model shows where its schema lives, how recently it changed, which frontend template consumes it, and how many fields have already drifted.</p>
      </section>
      <section class="grid-1">
        <article class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Owner</th>
                <th>Template</th>
                <th>Drift Signals</th>
                <th>Schema Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${models().map((model) => `
                <tr>
                  <td><strong>${model.modelName}</strong><div class="meta mono">${model.graphqlType}</div></td>
                  <td>${model.owner}</td>
                  <td class="mono">${model.frontendTemplate}</td>
                  <td>${model.driftSignals}</td>
                  <td>${model.lastSchemaChangeDaysAgo} days ago</td>
                  <td><span class="pill ${model.severity}">${model.severity}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </article>
      </section>
    `
  );
}

export function renderConsumers() {
  return pageShell(
    "Content Model Drift Detector",
    "consumers",
    `
      <section class="hero">
        <div class="eyebrow">Consumer board</div>
        <h1>Track which frontend and API consumers are lagging behind the content system.</h1>
        <p>This is the downstream view: who consumes which content model, how stale their validation window is, and what field assumptions are most likely to break first.</p>
      </section>
      <section class="grid-1">
        <article class="card section-card">
          ${consumers().map((consumer) => `
            <div class="list-row">
              <div>
                <h3>${consumer.name}</h3>
                <div class="meta">${consumer.surface} · models: ${consumer.models.join(", ")}</div>
                <div class="signal-list">${consumer.fragileFields.map((field) => `<span class="signal">${field}</span>`).join("")}</div>
              </div>
              <div>
                <span class="pill ${consumer.status}">${consumer.status}</span>
                <div class="meta" style="margin-top:10px;text-align:right;">${consumer.validationGapDays} days stale</div>
              </div>
            </div>
          `).join("")}
        </article>
      </section>
    `
  );
}

export function renderVerification() {
  const stats = summary();
  return pageShell(
    "Content Model Drift Detector",
    "verification",
    `
      <section class="hero">
        <div class="eyebrow">Verification</div>
        <h1>What the detector proves about the content system right now.</h1>
        <p>The current snapshot shows which fields are missing, orphaned, or changed, and whether downstream consumers are still inside a safe validation window.</p>
      </section>
      <section class="grid-4">
        <article class="card metric-card"><div class="label">Missing fields</div><div class="value">${stats.missingFieldCount}</div><p>Fields expected by consumers but absent from the current schema snapshot.</p></article>
        <article class="card metric-card"><div class="label">Orphaned fields</div><div class="value">${stats.orphanFieldCount}</div><p>Fields still present in content models but no longer earning their keep downstream.</p></article>
        <article class="card metric-card"><div class="label">Watch issues</div><div class="value">${stats.watchCount}</div><p>Changes that need review soon even if they are not publish blockers yet.</p></article>
        <article class="card metric-card"><div class="label">Stale consumers</div><div class="value">${stats.staleConsumerCount}</div><p>Consumers that have gone too long without contract validation.</p></article>
      </section>
    `
  );
}

export function renderDocs() {
  const routes = [
    ["/", "Overview dashboard and priority drift summary"],
    ["/drift-board", "Issue queue for breaking and watch-level contract drift"],
    ["/models", "Model-level schema posture and frontend template mapping"],
    ["/consumers", "Downstream consumer drift and validation lag"],
    ["/verification", "Top-line proof summary for current snapshot"],
    ["/api/dashboard/summary", "Overview metrics"],
    ["/api/models", "Model contract snapshots"],
    ["/api/drift-board", "Issue board payload"],
    ["/api/consumers", "Consumer drift payload"],
    ["/api/contracts", "Contract mapping per model"],
    ["/api/sample", "Full composite payload"],
  ] as const;

  return pageShell(
    "Content Model Drift Detector",
    "docs",
    `
      <section class="hero">
        <div class="eyebrow">Docs</div>
        <h1>Route and payload surface for the drift detector.</h1>
        <p>The HTML routes tell the operational story. The JSON routes expose the same contract posture for other tools, tests, or platform workflows.</p>
      </section>
      <section class="grid-1">
        <article class="table-shell">
          <table>
            <thead>
              <tr><th>Route</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              ${routes.map(([route, purpose]) => `
                <tr>
                  <td class="mono">${route}</td>
                  <td>${purpose}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </article>
      </section>
    `
  );
}
