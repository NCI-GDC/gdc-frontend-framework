import { App, Initials } from "../layout/UserFlowVariedPages";
import Image from "next/image";

export interface Clickable {
  readonly onClick?: () => void;
}

export const OncoGrid: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="OncoGrid" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Image
            src="/user-flow/oncogrid.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Visualize the top most mutated cases and genes affected by high impact mutations in your cohort.
        </div>
      </div>
    </App>
  );
};

export const SingleCellRnaSeq: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="scRNA-Seq" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Image
            src="/user-flow/scRnaSeqViz.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Visualize patterns in single-cell gene expression in your cohort.
        </div>
      </div>
    </App>
  );
};

export const GeneExpression: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Gene Expression" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Image
            src="/user-flow/gene-expression.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Visualize patterns in gene expression in your cohort.
        </div>
      </div>
    </App>
  );
};

export const ProteinPaint: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="ProteinPaint" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Image
            src="/user-flow/proteinpaint.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Visualize mutations in protein-coding genes.
        </div>
      </div>
    </App>
  );
};

export const SetOperations: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Set Operations" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Image
            src="/user-flow/set-operations.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Display Venn diagram and find intersection or union, etc. of your cohorts.
        </div>
      </div>
    </App>
  );
};

export const CohortComparison: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Cohort Comparison" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Cohort Comparison" />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Display the survival analysis of your case sets and compare characteristics such as gender, vital status and age at diagnosis.
        </div>
      </div>
    </App>
  );
};

export const ClinicalDataAnalysis: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Clinical Data Analysis" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Clinical Data Analysis" />
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Display basic statistical analyses for your cohort.
        </div>
      </div>
    </App>
  );
};

export const ClinicalFilters: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Clinical Filters" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Clinical Filters" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Use clinical (e.g demographic and diagnosis) information to refine the cases in your cohort.
        </div>
      </div>
    </App>
  );
};

export const Cohorts: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Cohorts" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Cohorts" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Explore the GDC's collection of cohorts. Select one or more to form your custom cohort.
        </div>
      </div>
    </App>
  );
};

export const BiospecimenFilters: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Biospecimen Filters" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Biospecimen Filters" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Use biospecimen (e.g. sample) information to refine the cases in your cohort.
        </div>
      </div>
    </App>
  );
};

export const DownloadableFileFilters: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Downloadable File Filters" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Downloadable File Filters" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Use the properties of associated files to refine the cases in your cohort.
        </div>
      </div>
    </App>
  );
};

export const SomaticMutations: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Somatic Mutations" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Somatic Mutations" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Refine your cohort based on specific somatic mutations or mutations in genes.
        </div>
      </div>
    </App>
  );
};

export const CopyNumberVariations: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Copy Number Variations" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Copy Number Variations" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Refine your cohort based on per-gene copy number variations.
        </div>
      </div>
    </App>
  );
};

export const Repository: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Repository" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Repository" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        Browse and download the files associated with your cohort.
        </div>
      </div>
    </App>
  );
};

export const CohortViewerApp: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Cohort Viewer" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Cohort Viewer" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
        View details about the cases in your cohort.
        </div>
      </div>
    </App>
  );
};