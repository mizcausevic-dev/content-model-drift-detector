export type DriftSeverity = "breaking" | "watch" | "healthy";

export interface ContentField {
  name: string;
  type: string;
  required: boolean;
  status: "stable" | "changed" | "orphaned" | "missing";
  usedBy: string[];
}

export interface ModelContract {
  modelKey: string;
  modelName: string;
  channel: "wordpress" | "headless" | "graphql";
  owner: string;
  contentType: string;
  publishCadence: string;
  frontendTemplate: string;
  graphqlType: string;
  restEndpoint: string;
  lastSchemaChangeDaysAgo: number;
  lastFrontendValidationDaysAgo: number;
  fields: ContentField[];
}

export interface DriftIssue {
  modelKey: string;
  title: string;
  severity: DriftSeverity;
  consumer: string;
  detail: string;
  nextAction: string;
}

export interface ConsumerContract {
  name: string;
  surface: string;
  models: string[];
  status: DriftSeverity;
  validationGapDays: number;
  fragileFields: string[];
}
