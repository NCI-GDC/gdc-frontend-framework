// TODO: Depreciate this file

import { UserFlowVariedPages } from "../../layout/UserFlowVariedPages";
import { CohortManager } from "../many-pages/cohort";
import React, { PropsWithChildren, useRef } from "react";
import { useState } from "react";
import { ContextualStudiesView } from "../../studies/StudiesView";
import { StudyView } from "../../studies/StudyView";
import { Image } from "@/components/Image";
import { FacetChart } from "../../charts/FacetChart";
import ReactModal from "react-modal";
import { ContextualCasesView } from "../../cases/CasesView/CasesView";
import {
  ClinicalFilters,
  GeneExpression,
  OncoGrid,
  ProteinPaint,
  SetOperations,
  SingleCellRnaSeq,
  Cohorts,
  BiospecimenFilters,
  DownloadableFileFilters,
  SomaticMutations,
  CopyNumberVariations,
  CohortComparison,
  ClinicalDataAnalysis,
  Repository,
  CohortViewerApp,
} from "../../apps/Apps";
//import { ContextualFilesView } from "../../files/FilesView";
import { CollapsibleContainer } from "../../../components/CollapsibleContainer";
import { SMTableContainer } from "@/components/expandableTables/somaticMutations/SMTableContainer";
import { GTableContainer } from "@/components/expandableTables/genes/GTableContainer";
import { FacetGroup } from "../../cohortBuilder/FacetGroup";
import { get_facets } from "../../cohortBuilder/dictionary";
import { FileModal } from "../../files/FileView";
import { GdcFile, FacetDefinition } from "@gff/core";
import { CaseModal } from "../../cases/CaseView";
import { Button } from "@mantine/core";

export interface BaseExplorationPageProps {
  readonly headerElements: ReadonlyArray<React.ReactNode>;
  readonly indexPath: string;
  readonly isCohortAppDisplayed: boolean;
}

export interface Case {
  readonly id: string;
  readonly submitterId: string;
  readonly primarySite: string;
  readonly projectId: string;
  readonly gender: string;
  readonly primaryDiagnosis: string;
  readonly tissueOrOrganOfOrigin: string;
}

export const BaseExplorationPage: React.FC<BaseExplorationPageProps> = ({
  headerElements,
  indexPath,
  isCohortAppDisplayed,
}: BaseExplorationPageProps) => {
  const [isExpressionsCollapsed, setIsExpressionsCollapsed] = useState(true);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [currentApp, setCurrentApp] = useState("appSelector");
  const [isStudyModalOpen, setStudyModalOpen] = useState(false);

  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(undefined as GdcFile);

  const [isCaseModalOpen, setCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(undefined as Case);

  // used to scroll to top of apps section
  const topOfApps = useRef(null);

  const CohortExpressions: React.FC<unknown> = () => {
    const Top = () => <div className="text-center">Cohort Criteria</div>;
    return (
      <CollapsibleContainer
        Top={Top}
        isCollapsed={isExpressionsCollapsed}
        toggle={() => setIsExpressionsCollapsed(!isExpressionsCollapsed)}
      >
        <div>
          <Image
            src="/user-flow/cohort-criteria.png"
            layout="responsive"
            height={142}
            width={3836}
          />
        </div>
      </CollapsibleContainer>
    );
  };

  const CohortSummary: React.FC<unknown> = () => {
    const Top = () => <div className="text-center">Summary</div>;
    return (
      <CollapsibleContainer
        Top={Top}
        isCollapsed={isSummaryCollapsed}
        toggle={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <FacetChart
            field="primary_site"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="demographic.gender"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="disease_type"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="samples.sample_type"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="samples.tissue_type"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="diagnoses.tissue_or_organ_of_origin"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
        </div>
      </CollapsibleContainer>
    );
  };

  return (
    <UserFlowVariedPages {...{ indexPath, headerElements }}>
      <div className="flex flex-col gap-y-4 p-4">
        <div className="border p-4 border-base-lighter bg-base-lightest">
          <CohortManager
            handleFileSelected={(file: GdcFile) => {
              setCurrentFile(file);
              setFileModalOpen(true);
            }}
            handleCaseSelected={(patient: Case) => {
              setCurrentCase(patient);
              setCaseModalOpen(true);
            }}
          />
        </div>
        <div className="bg-base-lightest">
          <CohortExpressions />
        </div>
        <div className="bg-base-lightest">
          <CohortSummary />
        </div>
        <div
          className="border p-4 border-gray-400 bg-base-lightest"
          ref={topOfApps}
        >
          {currentApp === "cohort-viewer" ? (
            <CohortViewer goBack={() => setCurrentApp("appSelector")} />
          ) : currentApp === "studies" ? (
            <AllAppsStudies
              returnToAllApps={() => setCurrentApp("appSelector")}
              viewStudy={() => setStudyModalOpen(true)}
            />
          ) : currentApp === "repository" ? (
            <AllAppsRepository
              returnToAllApps={() => setCurrentApp("appSelector")}
              handleFileSelected={(file: GdcFile) => {
                setCurrentFile(file);
                setFileModalOpen(true);
              }}
            />
          ) : currentApp === "unclegrid" ? (
            <AllAppsUncleGrid
              returnToAllApps={() => setCurrentApp("appSelector")}
            />
          ) : currentApp == "somatic-mutations" ? (
            <AllAppViewer title="Somatic Mutations" setView={setCurrentApp}>
              <div className="flex flex-row">
                <GTableContainer
                  selectedSurvivalPlot={undefined}
                  handleSurvivalPlotToggled={undefined}
                  handleGeneToggled={() => null}
                />
                <SMTableContainer
                  selectedSurvivalPlot={undefined}
                  handleSurvivalPlotToggled={undefined}
                />
              </div>
            </AllAppViewer>
          ) : currentApp == "clinical-filters" ? (
            <AllAppViewer title="Clinical Filters" setView={setCurrentApp}>
              {" "}
              <FacetGroup
                facetNames={get_facets("Clinical", "All") as FacetDefinition[]}
              />
            </AllAppViewer>
          ) : currentApp == "biospecimen-filters" ? (
            <AllAppViewer title="Biospecimen Filters" setView={setCurrentApp}>
              {" "}
              <FacetGroup
                facetNames={
                  get_facets("Biospecimen", "All") as FacetDefinition[]
                }
              />
            </AllAppViewer>
          ) : (
            // app selector
            <Apps
              isCohortAppDisplayed={isCohortAppDisplayed}
              setCurrentApp={(name) => {
                setCurrentApp(name);
                topOfApps.current.scrollIntoView();
              }}
            />
          )}
        </div>
      </div>
      <StudyModal
        isOpen={isStudyModalOpen}
        closeModal={() => setStudyModalOpen(false)}
      />
      <FileModal
        isOpen={isFileModalOpen}
        closeModal={() => setFileModalOpen(false)}
        file={currentFile}
      />
      <CaseModal
        isOpen={isCaseModalOpen}
        closeModal={() => setCaseModalOpen(false)}
        patient={currentCase}
      />
    </UserFlowVariedPages>
  );
};

interface AppsProps {
  readonly isCohortAppDisplayed: boolean;
  readonly setCurrentApp: (string) => void;
}

const Apps: React.FC<AppsProps> = ({
  isCohortAppDisplayed,
  setCurrentApp,
}: PropsWithChildren<AppsProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <Button>All</Button>
        <Button>Cohort Tools</Button>
        <Button>Cohort Filters</Button>
        <Button>Genomic Analysis</Button>
        <Button>File Tools</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {isCohortAppDisplayed && (
          <Cohorts onClick={() => setCurrentApp("studies")} />
        )}
        <ClinicalFilters onClick={() => setCurrentApp("clinical-filters")} />
        <BiospecimenFilters
          onClick={() => setCurrentApp("biospecimen-filters")}
        />
        <DownloadableFileFilters />
        <SomaticMutations onClick={() => setCurrentApp("somatic-mutations")} />
        <CopyNumberVariations />
        <SingleCellRnaSeq onClick={() => setCurrentApp("unclegrid")} />
        <OncoGrid onClick={() => setCurrentApp("unclegrid")} />
        <GeneExpression onClick={() => setCurrentApp("unclegrid")} />
        <ProteinPaint onClick={() => setCurrentApp("unclegrid")} />
        <CohortViewerApp onClick={() => setCurrentApp("cohort-viewer")} />
        <SetOperations onClick={() => setCurrentApp("unclegrid")} />
        <CohortComparison />
        <ClinicalDataAnalysis />
        <Repository onClick={() => setCurrentApp("repository")} />
      </div>
    </div>
  );
};

interface CohortViewerProps {
  readonly goBack: () => void;
}

const CohortViewer: React.FC<CohortViewerProps> = ({
  goBack,
}: PropsWithChildren<CohortViewerProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button onClick={goBack}>&lt; All Apps</button>
      </div>
      <ContextualCasesView />
    </div>
  );
};

interface StudyModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
}

const StudyModal: React.FC<StudyModalProps> = ({
  isOpen,
  closeModal,
}: StudyModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <StudyView />
    </ReactModal>
  );
};

interface AllAppsStudiesProps {
  readonly returnToAllApps: () => void;
  readonly viewStudy: (name: string) => void;
}

const AllAppsStudies = (props: AllAppsStudiesProps) => {
  const { returnToAllApps, viewStudy } = props;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={returnToAllApps}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">Cohorts</div>
      </div>
      <ContextualStudiesView setCurrentStudy={viewStudy} />
    </div>
  );
};

interface AllAppsRepositoryProps {
  readonly returnToAllApps: () => void;
  readonly handleFileSelected?: (file: GdcFile) => void;
}

const AllAppsRepository = (props: AllAppsRepositoryProps) => {
  const { returnToAllApps, handleFileSelected } = props;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={returnToAllApps}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">Repository</div>
      </div>
      TODO Fix ContextualFilesView if needed
      {handleFileSelected}
      {/*<ContextualFilesView handleFileSelected={handleFileSelected} /> */}
    </div>
  );
};

interface AllAppsUncleGridProps {
  readonly returnToAllApps: () => void;
}

const AllAppsUncleGrid = ({ returnToAllApps }: AllAppsUncleGridProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={returnToAllApps}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">OncoGrid</div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Image
          src="/user-flow/oncogrid-mock-up.png"
          layout="responsive"
          width="100%"
          height="100%"
        ></Image>
      </div>
    </div>
  );
};

/**
 * Generic AppView
 */
export interface AppViewProps {
  readonly title: string;
  readonly setView: (string) => void;
}

export const AllAppViewer: React.FC<AppViewProps> = ({
  title,
  setView,
  children,
}: PropsWithChildren<AppViewProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={() => setView("appSelector")}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">{title}</div>
      </div>
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};

/**
 * single entity modal
 * < prev  ID   next >
 * single entity view
 *
 * ---
 *
 * collection of entities view
 * - show collection of entities
 * - filters entities
 * - sorts entities
 *
 * select entities
 * set filter
 * set sort
 *
 * click entity -> set current entity
 *
 */
