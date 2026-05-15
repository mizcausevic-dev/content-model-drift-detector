import { consumerContracts, driftIssues, modelContracts } from "../data/sampleModels";
import type { ConsumerContract, DriftIssue, ModelContract } from "../types/drift";

export function summary() {
  const breakingCount = driftIssues.filter((issue) => issue.severity === "breaking").length;
  const watchCount = driftIssues.filter((issue) => issue.severity === "watch").length;
  const orphanFieldCount = modelContracts.flatMap((model) => model.fields).filter((field) => field.status === "orphaned").length;
  const missingFieldCount = modelContracts.flatMap((model) => model.fields).filter((field) => field.status === "missing").length;
  const staleConsumerCount = consumerContracts.filter((contract) => contract.validationGapDays > 14).length;
  const contractCoverage = Math.round(
    (modelContracts.flatMap((model) => model.fields).filter((field) => field.status === "stable").length /
      modelContracts.flatMap((model) => model.fields).length) *
      100
  );

  return {
    modelCount: modelContracts.length,
    driftedModels: new Set(driftIssues.map((issue) => issue.modelKey)).size,
    breakingCount,
    watchCount,
    orphanFieldCount,
    missingFieldCount,
    staleConsumerCount,
    contractCoverage,
    leadRecommendation:
      "Force publish-blocking checks on the missing and orphaned fields before the next schema promotion hits search, pricing, or answer-packaging consumers.",
  };
}

export function models(): Array<ModelContract & { severity: "breaking" | "watch" | "healthy"; driftSignals: number }> {
  return modelContracts.map((model) => {
    const issues = driftIssues.filter((issue) => issue.modelKey === model.modelKey);
    const severity = issues.some((issue) => issue.severity === "breaking")
      ? "breaking"
      : issues.some((issue) => issue.severity === "watch")
        ? "watch"
        : "healthy";
    const driftSignals = model.fields.filter((field) => field.status !== "stable").length;
    return {
      ...model,
      severity,
      driftSignals,
    };
  });
}

export function issueBoard(): DriftIssue[] {
  const rank = { breaking: 0, watch: 1, healthy: 2 } as const;
  return [...driftIssues].sort((left, right) => rank[left.severity] - rank[right.severity]);
}

export function consumers(): ConsumerContract[] {
  const rank = { breaking: 0, watch: 1, healthy: 2 } as const;
  return [...consumerContracts].sort((left, right) => rank[left.status] - rank[right.status]);
}

export function contracts() {
  return models().map((model) => ({
    modelKey: model.modelKey,
    modelName: model.modelName,
    frontendTemplate: model.frontendTemplate,
    graphqlType: model.graphqlType,
    restEndpoint: model.restEndpoint,
    changedFields: model.fields.filter((field) => field.status !== "stable"),
  }));
}

export function payload() {
  return {
    dashboard: summary(),
    models: models(),
    issueBoard: issueBoard(),
    consumers: consumers(),
    contracts: contracts(),
  };
}
