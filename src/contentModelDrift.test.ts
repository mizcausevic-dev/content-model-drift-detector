import { describe, expect, test } from "vitest";

import { consumers, contracts, issueBoard, models, payload, summary } from "./services/driftService";

describe("content-model-drift-detector", () => {
  test("summary reflects modeled drift counts", () => {
    const stats = summary();
    expect(stats.modelCount).toBe(4);
    expect(stats.breakingCount).toBeGreaterThan(0);
    expect(stats.contractCoverage).toBeLessThan(100);
  });

  test("models expose severity and drift signals", () => {
    const modelRows = models();
    expect(modelRows[0]).toHaveProperty("severity");
    expect(modelRows.some((model) => model.driftSignals > 0)).toBe(true);
  });

  test("payload includes contracts and consumers", () => {
    expect(issueBoard().length).toBeGreaterThan(0);
    expect(consumers().length).toBeGreaterThan(0);
    expect(contracts().length).toBe(4);
    expect(payload()).toHaveProperty("dashboard");
  });
});
