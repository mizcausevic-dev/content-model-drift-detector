import assert from "node:assert/strict";
import { AddressInfo } from "node:net";

import app from "../src/app";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  assert.equal(response.status, 200, `Expected 200 from ${url}, received ${response.status}`);
  return (await response.json()) as T;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url);
  assert.equal(response.status, 200, `Expected 200 from ${url}, received ${response.status}`);
  return response.text();
}

async function main() {
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve) => server.once("listening", () => resolve()));
    const address = server.address() as AddressInfo;
    const base = `http://127.0.0.1:${address.port}`;

    const overview = await fetchHtml(`${base}/`);
    assert.match(overview, /Find schema breakage before content publish breaks the frontend/i);

    const docs = await fetchHtml(`${base}/docs`);
    assert.match(docs, /Route and payload surface for the drift detector/i);

    const summary = await fetchJson<{ modelCount: number; contractCoverage: number }>(`${base}/api/dashboard/summary`);
    assert.equal(summary.modelCount, 4);
    assert.equal(summary.contractCoverage, 56);

    const driftBoard = await fetchJson<Array<{ severity: string }>>(`${base}/api/drift-board`);
    assert.ok(driftBoard.some((issue) => issue.severity === "breaking"));

    console.log("smoke check passed");
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
