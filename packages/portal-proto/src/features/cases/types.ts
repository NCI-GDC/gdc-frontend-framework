export interface Case {
  readonly id: string;
  readonly submitterId: string;
  readonly primarySite: string;
  readonly projectId: string;
  readonly gender: string;
  readonly primaryDiagnosis: string;
  readonly tissueOrOrganOfOrigin: string;
}
