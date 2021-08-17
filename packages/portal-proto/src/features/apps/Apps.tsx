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
          I am OncoGrid
        </div>
      </div>
    </App>
  );
};

export const SingleCellRnaSeq: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="scRNA-Seq" onClick={props.onClick}>
      <div className="w-full h-full relative">
        <Image
          src="/user-flow/scRnaSeqViz.png"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </App>
  );
};

export const GeneExpression: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Gene Expression" onClick={props.onClick}>
      <div className="w-full h-full relative">
        <Image
          src="/user-flow/gene-expression.png"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </App>
  );
};

export const ProteinPaint: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="ProteinPaint" onClick={props.onClick}>
      <div className="w-full h-full relative">
        <Image
          src="/user-flow/proteinpaint.png"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </App>
  );
};

export const SetOperations: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Set Operations" onClick={props.onClick}>
      <div className="w-full h-full relative">
        <Image
          src="/user-flow/set-operations.png"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </App>
  );
};

export const ClincialFilters: React.FC<Clickable> = (props: Clickable) => {
  return (
    <App name="Clinical Filters" onClick={props.onClick}>
      <div className="w-full h-full">
        <div className="w-full h-full relative group-hover:hidden">
          <Initials name="Clinical Filters" />;
        </div>
        <div className="w-full h-full hidden group-hover:block">
          I am Clinical Filters
        </div>
      </div>
    </App>
  );
};
