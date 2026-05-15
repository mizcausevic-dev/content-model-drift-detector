import { consumers, contracts, issueBoard, models, summary } from "../src/services/driftService";

const snapshot = {
  dashboard: summary(),
  breakingIssues: issueBoard().filter((issue) => issue.severity === "breaking").length,
  watchIssues: issueBoard().filter((issue) => issue.severity === "watch").length,
  staleConsumers: consumers().filter((consumer) => consumer.status !== "healthy").map((consumer) => consumer.name),
  modelStatuses: models().map((model) => ({
    modelKey: model.modelKey,
    severity: model.severity,
    driftSignals: model.driftSignals
  })),
  contracts: contracts().map((contract) => ({
    modelKey: contract.modelKey,
    changedFields: contract.changedFields
  }))
};

console.log(JSON.stringify(snapshot, null, 2));
