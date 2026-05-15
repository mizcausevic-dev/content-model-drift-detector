import express from "express";

import { consumers, contracts, issueBoard, models, payload, summary } from "./services/driftService";
import {
  renderConsumers,
  renderDocs,
  renderDriftBoard,
  renderModels,
  renderOverview,
  renderVerification
} from "./services/render";

const app = express();
const port = Number(process.env.PORT ?? 5072);

app.get("/", (_req, res) => {
  res.type("html").send(renderOverview());
});

app.get("/drift-board", (_req, res) => {
  res.type("html").send(renderDriftBoard());
});

app.get("/models", (_req, res) => {
  res.type("html").send(renderModels());
});

app.get("/consumers", (_req, res) => {
  res.type("html").send(renderConsumers());
});

app.get("/verification", (_req, res) => {
  res.type("html").send(renderVerification());
});

app.get("/docs", (_req, res) => {
  res.type("html").send(renderDocs());
});

app.get("/api/dashboard/summary", (_req, res) => {
  res.json(summary());
});

app.get("/api/models", (_req, res) => {
  res.json(models());
});

app.get("/api/drift-board", (_req, res) => {
  res.json(issueBoard());
});

app.get("/api/consumers", (_req, res) => {
  res.json(consumers());
});

app.get("/api/contracts", (_req, res) => {
  res.json(contracts());
});

app.get("/api/sample", (_req, res) => {
  res.json(payload());
});

if (require.main === module) {
  app.listen(port, "127.0.0.1", () => {
    console.log(`Content Model Drift Detector listening on http://127.0.0.1:${port}`);
  });
}

export default app;
