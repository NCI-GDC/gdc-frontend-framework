import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import ReactModal from "react-modal";
import {
  App,
  Button,
  Card,
  Graph,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Select from "react-select";
import Image from "next/image";
import { CohortManager } from "../../../features/user-flow/most-pages/cohort";
import classNames from "classnames";

const AnalysisPage: NextPage = () => {
  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

  const options = [
    { value: "cb-modal", label: "Cohort Buidler Modal" },
    { value: "cb-expand", label: "Cohort Builder Expand" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    <Link key="Studies" href="/user-flow/most-pages/studies">
      Studies
    </Link>,
    "Analysis",
    <Link key="Repository" href="/user-flow/most-pages/repository">
      Repository
    </Link>,
  ];

  const Options = () => (
    <Select
      inputId="analysis-proto-options"
      isSearchable={false}
      value={protoOption}
      options={options}
      onChange={(v) => setProtoOption(v)}
    />
  );

  const Apps = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          "OncoGrid",
          "Gene Expression",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ].map((name, i) => (
          <App
            key={`${name}-${i}`}
            name={name}
            onClick={() => {
              setSelectedApp(name);
              setShowAppModal(true);
            }}
          />
        ))}
      </div>
    );
  };

  interface CohortBuilderProps {
    readonly show?: boolean;
  }
  const CohortBuilder: React.FC<CohortBuilderProps> = ({
    show = true,
  }: CohortBuilderProps) => {
    return (
      <div
        className={classNames("flex-col gap-y-4 overflow-y-auto", {
          hidden: !show,
          flex: show,
        })}
      >
        <div className="border p-4">
          Expressions + Builder
          <div className="h-96"></div>
        </div>
        <div className="border p-4">
          <Tabs>
            <TabList>
              <Tab>Summary</Tab>
              <Tab>Cases</Tab>
            </TabList>

            <TabPanel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                <Graph />
                <Graph />
                <Graph />
                <Graph />
                <Graph />
                <Graph />
              </div>
            </TabPanel>
            <TabPanel>
              <Cases />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  };

  const CohortBuilderModal = () => {
    return (
      <ReactModal
        isOpen={showCohortBuilderModal}
        onRequestClose={() => setShowCohortBuilderModal(false)}
      >
        <CohortBuilder />
      </ReactModal>
    );
  };

  const AppModal = () => {
    return (
      <ReactModal
        isOpen={showAppModal}
        onRequestClose={() => setShowAppModal(false)}
      >
        <div className="flex flex-col h-full">
          <div>App: {selectedApp}</div>
          <div className="flex-grow">
            <Card />
          </div>
        </div>
      </ReactModal>
    );
  };

  const ActionElement = () => {
    if (protoOption.value === "cb-modal") {
      return (
        <Image
          src="/expand-svgrepo-com.svg"
          width="32rem"
          height="32rem"
          onClick={() => setShowCohortBuilderModal(true)}
        />
      );
    } else {
      // TODO use expand/collapse icons
      if (isExpanded) {
        return <Button onClick={() => setIsExpanded(false)}>^</Button>;
      } else {
        return <Button onClick={() => setIsExpanded(true)}>v</Button>;
      }
    }
  };

  const ExpandElement = () => {
    return <CohortBuilder show={isExpanded} />;
  };

  return (
    <UserFlowVariedPages {...{ headerElements, Options }}>
      <CohortBuilderModal />
      <AppModal />
      <div className="flex flex-col p-4 gap-y-4">
        <div className="border p-4 border-gray-400">
          <CohortManager
            ActionElement={ActionElement}
            ExpandElement={ExpandElement}
          />
        </div>
        <div className="border p-4 border-gray-400">
          <Apps />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default AnalysisPage;

const Cases = () => {
  const cases = [
    {
      id: "38f93ca8-4971-4932-b592-0a17eaece2ad",
      submitter_id: "C3L-02115",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "5ea1361a-050d-4fa0-be59-b530c456b6e3",
      submitter_id: "C3L-00928",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Pancreas, NOS",
    },
    {
      id: "690378f3-e38a-4b25-8489-05a3b4bd40b6",
      submitter_id: "C3N-01175",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "female",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "6b4f086e-4ef9-4f30-874e-8a155b2e3bab",
      submitter_id: "C3N-04276",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Larynx, NOS",
    },
    {
      id: "922ba915-5f64-49fe-95a6-e37afdeb06bd",
      submitter_id: "C3L-01256",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Endometrium",
    },
    {
      id: "5119c0a8-d0ef-4ec2-b58c-0ff9e0c8f1db",
      submitter_id: "C3L-00994",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Tongue, NOS",
    },
    {
      id: "417c1659-201c-4d1d-99bf-c28c986c559d",
      submitter_id: "C3N-02529",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Middle lobe, lung",
    },
    {
      id: "ce10e6ca-05e1-4495-a3e6-868d375207ca",
      submitter_id: "C3N-03456",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Floor of mouth, NOS",
    },
    {
      id: "217a5718-a04e-4225-b362-98d2825b1617",
      submitter_id: "C3N-00517",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "c97152dc-91b5-4250-a35f-e98a9c4df909",
      submitter_id: "C3L-02665",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Middle lobe, lung",
    },
    {
      id: "e8df42d8-58bc-4c43-b18b-5b23f5e61508",
      submitter_id: "C3N-03086",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Body of pancreas",
    },
    {
      id: "15c75ba8-a995-46e3-a7d8-a54fbf310bc0",
      submitter_id: "C3N-01716",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "465c6020-db87-4c81-a52c-1b23a78d5adc",
      submitter_id: "C3L-00625",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "4bf8bf07-3a82-4723-818c-dd66643bef07",
      submitter_id: "C3N-02713",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Larynx, NOS",
    },
    {
      id: "ce1ca93c-73f2-43e8-a060-c0a6f975203d",
      submitter_id: "C3N-02300",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Lung, NOS",
    },
    {
      id: "780293db-9419-45b4-8e57-2c659f31a252",
      submitter_id: "C3L-01248",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Endometrium",
    },
    {
      id: "21b33512-73c8-4d7f-a6ce-a07133b9c1ed",
      submitter_id: "C3L-00010",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "211bc56d-ce9d-43ab-add5-850b13c35f50",
      submitter_id: "C3L-00362",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "7e18715d-3d61-431b-94f5-4d20bbaa4fa1",
      submitter_id: "C3N-00313",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "female",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "b9aedaec-788a-4f8f-8d56-773745b802b9",
      submitter_id: "C3L-00356",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "796c409b-9a37-4a6c-a1e2-518ea3cd9fe7",
      submitter_id: "C3L-03387",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Parietal lobe",
    },
    {
      id: "a02322a0-c133-4220-a6f1-508f90a99f8e",
      submitter_id: "C3N-01489",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lung, NOS",
    },
    {
      id: "85b39e71-9ebf-40f6-be6b-82d1f5250f21",
      submitter_id: "C3L-01890",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "8e57d0f0-c8f5-4aec-acd4-5c00a0b67c66",
      submitter_id: "C3L-00510",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lower lobe, lung",
    },
    {
      id: "4d3ea8f7-10fe-4a79-a8db-7eca535633ef",
      submitter_id: "C3N-04126",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "e8d31ee4-804b-4557-a70c-9e6df8e25606",
      submitter_id: "C3L-00083",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "1632bbd5-d5ba-42e4-aee4-c8637991a892",
      submitter_id: "C3L-01051",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "bb32a75f-8129-4549-9635-9dc67e610a80",
      submitter_id: "C3N-01413",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "669caded-109b-422e-9c91-2de87edfd052",
      submitter_id: "C3N-00198",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Body of pancreas",
    },
    {
      id: "5718a50d-332c-4882-8736-2ca8989946dd",
      submitter_id: "C3L-02984",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Frontal lobe",
    },
    {
      id: "2afd7fdf-b52a-4945-8688-07ed694d630a",
      submitter_id: "C3N-03061",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Body of pancreas",
    },
    {
      id: "46fd5848-ddb3-4cbf-97ce-c94d72910679",
      submitter_id: "C3L-01124",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "097d76e4-0811-4ac5-85b8-4e3704e8d6c2",
      submitter_id: "C3L-03748",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "female",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Frontal lobe",
    },
    {
      id: "accb52e6-eb07-4da7-9cd4-318b7e2f4c18",
      submitter_id: "C3L-00368",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "26d9cf48-feb1-4bfc-a983-0a03861b1b45",
      submitter_id: "GTEX-Y8DK-0011-R10A-SM-HAKY1",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: null,
      tissue_or_organ_of_origin: null,
    },
    {
      id: "da1fdb3c-3031-4072-8ca8-96f1729ac276",
      submitter_id: "C3L-02809",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "f3e8e047-a18b-47a2-8c3b-60b34ebe54f7",
      submitter_id: "C3L-01453",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Tail of pancreas",
    },
    {
      id: "30bf3778-fb08-4568-b6d2-dbcb5d2b1ee6",
      submitter_id: "C3L-00917",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "92f9a812-668e-49e2-915a-4751401ace57",
      submitter_id: "C3N-03008",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "female",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Floor of mouth, NOS",
    },
    {
      id: "239a5fbb-0145-46f6-8ec3-2a96a04011dd",
      submitter_id: "C3N-00494",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "1827eb4b-38f3-45b5-a833-156ba748c784",
      submitter_id: "C3N-00662",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "female",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Temporal lobe",
    },
    {
      id: "5735655b-b57a-4a27-8fbe-4e4a24150b1c",
      submitter_id: "C3L-02708",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Parietal lobe",
    },
    {
      id: "67d29568-8cdf-4b73-a942-9a882dd304a4",
      submitter_id: "C3L-01703",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Pancreas, NOS",
    },
    {
      id: "cf958f8c-f1c7-4adb-ad0f-fab5133042ed",
      submitter_id: "C3N-03433",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Tongue, NOS",
    },
    {
      id: "75893e8d-5e50-4c19-82c2-2f2c208c216b",
      submitter_id: "C3L-07034",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: null,
      tissue_or_organ_of_origin: null,
    },
    {
      id: "85e4b395-dde7-49c4-92c3-47d168cfb390",
      submitter_id: "C3L-03513",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: null,
      tissue_or_organ_of_origin: null,
    },
    {
      id: "3cbb1a43-04e0-42de-9e40-0aff8356f38e",
      submitter_id: "C3L-00918",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "5690ba19-ef88-4bce-b275-27f715cc44d4",
      submitter_id: "C3L-01861",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "0cd609d4-6eea-4fa8-a12b-6609830996e1",
      submitter_id: "C3N-03754",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "36361a20-f41c-4a56-aba6-1060d2ae0182",
      submitter_id: "C3L-01836",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "ab0750f5-2589-4ec3-a1f0-841eb456dec9",
      submitter_id: "C3N-03007",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "8ac75c82-eb1a-4e9b-bbe9-131a78a9f540",
      submitter_id: "C3N-01016",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lung, NOS",
    },
    {
      id: "6acf365b-19ce-4c97-92dd-865540a47e67",
      submitter_id: "C3L-02642",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Frontal lobe",
    },
    {
      id: "132c8ce3-b670-43c6-9ba1-4be9188cedce",
      submitter_id: "C3L-03400",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "female",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Temporal lobe",
    },
    {
      id: "4ae395b9-0a62-40dc-b476-ad60aa70991a",
      submitter_id: "C3L-01885",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "1e5eaf10-f6f1-4ab1-b0bf-fc3e0718b6bb",
      submitter_id: "C3L-02900",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Occipital lobe",
    },
    {
      id: "a890f443-ee68-4d5f-8f0e-eb0f62674bad",
      submitter_id: "C3L-00995",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Cheek mucosa",
    },
    {
      id: "f18c9bec-1c23-45f1-a6df-0113f1d851c1",
      submitter_id: "C3L-07036",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: null,
      tissue_or_organ_of_origin: null,
    },
    {
      id: "66a96642-003e-4c56-9a48-adc3ea90292d",
      submitter_id: "C3L-00448",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "e4af20c0-d3bc-4a77-82ef-2759c1096c7c",
      submitter_id: "C3N-01757",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Larynx, NOS",
    },
    {
      id: "0ca627b8-1b3f-4bf3-9626-1129fbe0b59d",
      submitter_id: "C3L-00938",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "cad8f812-c1cd-4ad8-97cf-4aef0cda8b69",
      submitter_id: "C3N-03884",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "1f9bd893-4a8c-47ae-aa59-c32b5a430575",
      submitter_id: "C3N-03457",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Floor of mouth, NOS",
    },
    {
      id: "d29e1f8c-860c-450c-b065-08728ea7a7a4",
      submitter_id: "GTEX-RN5K-0011-R10A-SM-HAKXU",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "female",
      primary_diagnosis: null,
      tissue_or_organ_of_origin: null,
    },
    {
      id: "09023877-f316-4848-8b99-219d943d4a2f",
      submitter_id: "C3N-02572",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lower lobe, lung",
    },
    {
      id: "0f9f8f46-5e6c-4bae-938d-218c192b199b",
      submitter_id: "C3L-01157",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "female",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Brain, NOS",
    },
    {
      id: "30d5de9e-822e-4794-9a3e-cf1bccf1dab7",
      submitter_id: "C3N-02333",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Larynx, NOS",
    },
    {
      id: "f28fc405-1fac-4ee0-b398-e0ddf7b4e639",
      submitter_id: "C3L-00445",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Middle lobe, lung",
    },
    {
      id: "4946b095-1252-477d-b5ad-cc57a0e03089",
      submitter_id: "C3L-02365",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lower lobe, lung",
    },
    {
      id: "8dca2f9c-208b-4d06-a588-0cafd175be7e",
      submitter_id: "C3N-01023",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lung, NOS",
    },
    {
      id: "f8ced7cc-1962-4825-b63e-da8a1fb42cf2",
      submitter_id: "C3L-03266",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "female",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Parietal lobe",
    },
    {
      id: "ba4f0ba9-f184-458e-81ba-9c4b1c521336",
      submitter_id: "C3L-02504",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Occipital lobe",
    },
    {
      id: "cfc61554-67b2-4ab4-813c-5f9b72bc325e",
      submitter_id: "C3N-02379",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "ba0fe300-d3f0-42fd-b609-3ee3d0e49d7b",
      submitter_id: "11LU035",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lung, NOS",
    },
    {
      id: "c6c75c5d-b3c9-4918-8dc2-02849933cd3c",
      submitter_id: "C3N-01220",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "48fc4c94-cdc4-467b-b4e9-3646c7f01b4f",
      submitter_id: "C3L-03123",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "8d3ea3ee-ece0-4423-b2d0-54b0c3c4928c",
      submitter_id: "C3N-01380",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "ffef8d1d-f99d-4cc0-9f49-46488bfca131",
      submitter_id: "C3L-00586",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "d7c0e370-f778-4995-963a-7a55525b2d76",
      submitter_id: "C3N-00223",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "887df04b-32fa-4f96-abe2-3fb9128ae51f",
      submitter_id: "C3L-00932",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "0b2f0141-88e1-4117-a668-f284ec7670ff",
      submitter_id: "C3L-03639",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "male",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "d79d4830-d55e-4efe-bf00-9543461c7af4",
      submitter_id: "C3L-00415",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Lower lobe, lung",
    },
    {
      id: "a231aaba-b584-42c4-96a9-f010bd1b3c66",
      submitter_id: "11LU013",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lung, NOS",
    },
    {
      id: "5d66be2e-e3a3-460d-ac80-0ac8112ba9c6",
      submitter_id: "C3L-01889",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "2b30ee57-9fec-4b82-84d8-d3b03ccac9cd",
      submitter_id: "C3N-01405",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "ad9a7ce1-9f9e-4092-8eae-493297289022",
      submitter_id: "C3L-00791",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "dc7add32-3201-4727-a88c-a86c18150970",
      submitter_id: "C3N-00436",
      project_id: "CPTAC-3",
      primary_site: "Pancreas",
      gender: "female",
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      tissue_or_organ_of_origin: "Head of pancreas",
    },
    {
      id: "df705995-5310-43be-a3ef-d97ab439bc86",
      submitter_id: "C3N-02575",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Lower lobe, lung",
    },
    {
      id: "1d9e5581-e821-4b6e-966e-bfc24301452f",
      submitter_id: "C3N-01212",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "14b0b2d5-46a1-426c-aec2-9b6520f92347",
      submitter_id: "C3N-01946",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Larynx, NOS",
    },
    {
      id: "8cf7fd21-a16f-426d-b722-53edc5161f89",
      submitter_id: "C3L-00139",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Corpus uteri",
    },
    {
      id: "46be30d5-b623-4469-a1d3-fbc76a62cca5",
      submitter_id: "C3N-00550",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Lower lobe, lung",
    },
    {
      id: "39ad94db-bfc7-4cf1-92ab-00ba05e1da0a",
      submitter_id: "C3L-04071",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "a7b5ecd7-d16b-4c41-87d7-881c3d53d185",
      submitter_id: "C3N-00390",
      project_id: "CPTAC-3",
      primary_site: "Kidney",
      gender: "male",
      primary_diagnosis: "Renal cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Kidney, NOS",
    },
    {
      id: "2b1894fb-b168-42ca-942f-a5def0bb8309",
      submitter_id: "C3L-00563",
      project_id: "CPTAC-3",
      primary_site: "Uterus, NOS",
      gender: "female",
      primary_diagnosis: "Endometrioid adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Endometrium",
    },
    {
      id: "59ee99cb-b820-4ae2-9306-105205f1bcb8",
      submitter_id: "C3L-01330",
      project_id: "CPTAC-3",
      primary_site: "Bronchus and lung",
      gender: "female",
      primary_diagnosis: "Adenocarcinoma, NOS",
      tissue_or_organ_of_origin: "Upper lobe, lung",
    },
    {
      id: "39f5218a-5a5c-452a-916a-d840fa9757d8",
      submitter_id: "C3N-03027",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Floor of mouth, NOS",
    },
    {
      id: "701129b7-d95a-4fac-a9be-0d0da0642a81",
      submitter_id: "C3N-04273",
      project_id: "CPTAC-3",
      primary_site: "Other and ill-defined sites",
      gender: "male",
      primary_diagnosis: "Squamous cell carcinoma, NOS",
      tissue_or_organ_of_origin: "Oropharynx, NOS",
    },
    {
      id: "a270e912-5fda-4f46-8450-a77dc78ce53f",
      submitter_id: "C3N-03183",
      project_id: "CPTAC-3",
      primary_site: "Brain",
      gender: "male",
      primary_diagnosis: "Glioblastoma",
      tissue_or_organ_of_origin: "Brain, NOS",
    },
  ];

  return (
    <div className="overflow-y-auto h-96">
      <table
        className="table-auto border-collapse border-gray-400 w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
          <tr className="bg-gray-400">
            <th className="px-2">Case</th>
            <th className="px-2">Project</th>
            <th className="px-2">Primary Site</th>
            <th className="px-2">Gender</th>
            <th className="px-2">Primary Diagnosis</th>
            <th className="px-2 whitespace-nowrap">Tissue/Organ of Origin</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c, i) => (
            <tr key={c.id} className={i % 2 == 0 ? "bg-gray-200" : ""}>
              <td className="px-2 break-all">{c.submitter_id}</td>
              <td className="px-2 whitespace-nowrap">{c.project_id}</td>
              <td className="px-2">{c.primary_site}</td>
              <td className="px-2">{c.gender}</td>
              <td className="px-2">{c.primary_diagnosis}</td>
              <td className="px-2">{c.tissue_or_organ_of_origin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
