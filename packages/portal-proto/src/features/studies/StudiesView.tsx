import { ProjectDefaults, useGetProjectsQuery } from "@gff/core";
import { Option, Select } from "../../components/Select";
import { Image } from "@/components/Image";
import { Button } from "@mantine/core";
import { MdFlip, MdSearch } from "react-icons/md";
import { BsQuestionCircleFill, BsFillTriangleFill } from "react-icons/bs";
import { useState } from "react";
import { FacetChart } from "../charts/FacetChart";
import { StudiesButton } from "@/features/studies/components";

const DLBCL: ProjectDefaults = {
  project_id: "DLBCL",
  name: "Diffuse Large B-Cell Lymphoma",
  primary_site: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ],
  disease_type: ["Mature B-Cell Lymphomas"],
  dbgap_accession_number: "phs123212",
};

export interface ContextualStudiesViewProps {
  readonly setCurrentStudy: (name: string) => void;
}

export const ContextualStudiesView: React.FC<ContextualStudiesViewProps> = (
  props: ContextualStudiesViewProps,
) => {
  const { data } = useGetProjectsQuery({ size: 100 });
  return (
    <StudiesView
      projects={data.projectData ? [{ ...DLBCL, ...data.projectData }] : []}
      {...props}
    />
  );
};

export interface StudiesViewProps {
  readonly projects: ReadonlyArray<ProjectDefaults>;
  readonly setCurrentStudy: (name: string) => void;
}

export const StudiesView: React.FC<StudiesViewProps> = ({
  projects,
  setCurrentStudy,
}: StudiesViewProps) => {
  const diseaseTypeOptions = [
    { value: "acinar cell neoplasms", label: "acinar cell neoplasms" },
    {
      value: "adenomas and adenocarcinomas",
      label: "adenomas and adenocarcinomas",
    },
    {
      value: "adnexal and skin appendage neoplasms",
      label: "adnexal and skin appendage neoplasms",
    },
    { value: "basal cell neoplasms", label: "basal cell neoplasms" },
    { value: "blood vessel tumors", label: "blood vessel tumors" },
    {
      value: "chronic myeloproliferative disorders",
      label: "chronic myeloproliferative disorders",
    },
    {
      value: "complex epithelial neoplasms",
      label: "complex epithelial neoplasms",
    },
    {
      value: "complex mixed and stromal neoplasms",
      label: "complex mixed and stromal neoplasms",
    },
    {
      value: "cystic, mucinous and serous neoplasms",
      label: "cystic, mucinous and serous neoplasms",
    },
    {
      value: "ductal and lobular neoplasms",
      label: "ductal and lobular neoplasms",
    },
    { value: "epithelial neoplasms, nos", label: "epithelial neoplasms, nos" },
    { value: "fibroepithelial neoplasms", label: "fibroepithelial neoplasms" },
    { value: "fibromatous neoplasms", label: "fibromatous neoplasms" },
    { value: "germ cell neoplasms", label: "germ cell neoplasms" },
    { value: "giant cell tumors", label: "giant cell tumors" },
    { value: "gliomas", label: "gliomas" },
    {
      value: "granular cell tumors and alveolar soft part sarcomas",
      label: "granular cell tumors and alveolar soft part sarcomas",
    },
    { value: "hodgkin lymphoma", label: "hodgkin lymphoma" },
    {
      value: "immunoproliferative diseases",
      label: "immunoproliferative diseases",
    },
    { value: "leukemias, nos", label: "leukemias, nos" },
    { value: "lipomatous neoplasms", label: "lipomatous neoplasms" },
    { value: "lymphatic vessel tumors", label: "lymphatic vessel tumors" },
    { value: "lymphoid leukemias", label: "lymphoid leukemias" },
    {
      value: "malignant lymphomas, nos or diffuse",
      label: "malignant lymphomas, nos or diffuse",
    },
    { value: "mast cell tumors", label: "mast cell tumors" },
    { value: "mature b-cell lymphomas", label: "mature b-cell lymphomas" },
    {
      value: "mature t- and nk-cell lymphomas",
      label: "mature t- and nk-cell lymphomas",
    },
    { value: "meningiomas", label: "meningiomas" },
    { value: "mesonephromas", label: "mesonephromas" },
    { value: "mesothelial neoplasms", label: "mesothelial neoplasms" },
    { value: "miscellaneous bone tumors", label: "miscellaneous bone tumors" },
    { value: "miscellaneous tumors", label: "miscellaneous tumors" },
    { value: "mucoepidermoid neoplasms", label: "mucoepidermoid neoplasms" },
    { value: "myelodysplastic syndromes", label: "myelodysplastic syndromes" },
    { value: "myeloid leukemias", label: "myeloid leukemias" },
    { value: "myomatous neoplasms", label: "myomatous neoplasms" },
    { value: "myxomatous neoplasms", label: "myxomatous neoplasms" },
    {
      value: "neoplasms of histiocytes and accessory lymphoid cells",
      label: "neoplasms of histiocytes and accessory lymphoid cells",
    },
    { value: "neoplasms, nos", label: "neoplasms, nos" },
    { value: "nerve sheath tumors", label: "nerve sheath tumors" },
    {
      value: "neuroepitheliomatous neoplasms",
      label: "neuroepitheliomatous neoplasms",
    },
    { value: "nevi and melanomas", label: "nevi and melanomas" },
    { value: "not applicable", label: "not applicable" },
    { value: "not reported", label: "not reported" },
    { value: "odontogenic tumors", label: "odontogenic tumors" },
    {
      value: "osseous and chondromatous neoplasms",
      label: "osseous and chondromatous neoplasms",
    },
    { value: "other leukemias", label: "other leukemias" },
    {
      value: "paragangliomas and glomus tumors",
      label: "paragangliomas and glomus tumors",
    },
    { value: "plasma cell tumors", label: "plasma cell tumors" },
    {
      value: "precursor cell lymphoblastic lymphoma",
      label: "precursor cell lymphoblastic lymphoma",
    },
    {
      value: "soft tissue tumors and sarcomas, nos",
      label: "soft tissue tumors and sarcomas, nos",
    },
    {
      value: "specialized gonadal neoplasms",
      label: "specialized gonadal neoplasms",
    },
    { value: "squamous cell neoplasms", label: "squamous cell neoplasms" },
    { value: "synovial-like neoplasms", label: "synovial-like neoplasms" },
    {
      value: "thymic epithelial neoplasms",
      label: "thymic epithelial neoplasms",
    },
    {
      value: "transitional cell papillomas and carcinomas",
      label: "transitional cell papillomas and carcinomas",
    },
    { value: "trophoblastic neoplasms", label: "trophoblastic neoplasms" },
    { value: "unknown", label: "unknown" },
  ];
  const filterBox = (obj) => {
    const { data, title } = obj;
    return (
      <div className="bg-base-lightest border border-base-lighter shadow-md rounded">
        <div className="bg-base-lightest p-2 rounded flex">
          <span className="flex-grow">{title}</span>
          <button className="text-2xl opacity-75 hover:opacity-100">
            <MdSearch title="Search" />
          </button>
        </div>
        <div className="bg-base-lightest pl-2 flex border-b">
          <input
            className="mt-2 border-2 rounded"
            type="checkbox"
            title="select all"
          />
          <div className="text-xs flex flex-col px-1">
            <button className="pt-1 px-1 opacity-50 hover:opacity-75">
              <BsFillTriangleFill title="Up" />
            </button>
            <button className="pt-1 px-1 opacity-50 hover:opacity-75 transform rotate-180">
              <BsFillTriangleFill title="Down" />
            </button>
          </div>
        </div>
        <ul className="h-52 overflow-x-scroll bg-base-lightest p-2">
          {data.map((data) => {
            const { value } = data;
            return (
              <li key={`${value}`} className="">
                <label className="flex py-1">
                  <input className="mt-1" type="checkbox" value={`${value}`} />
                  <span className="pl-2 truncate block">{value}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  const diseaseTypeFilter = filterBox({
    title: "Disease Types",
    data: diseaseTypeOptions,
    inputId: "studies-view__disease-type",
  });

  const primarySiteOptions: ReadonlyArray<Option> = [
    { value: "adrenal gland", label: "adrenal gland" },
    { value: "anus and anal canal", label: "anus and anal canal" },
    { value: "base of tongue", label: "base of tongue" },
    { value: "bladder", label: "bladder" },
    {
      value: "bones, joints and articular cartilage of limbs",
      label: "bones, joints and articular cartilage of limbs",
    },
    {
      value:
        "bones, joints and articular cartilage of other and unspecified sites",
      label:
        "bones, joints and articular cartilage of other and unspecified sites",
    },
    { value: "brain", label: "brain" },
    { value: "breast", label: "breast" },
    { value: "bronchus and lung", label: "bronchus and lung" },
    { value: "cervix uteri", label: "cervix uteri" },
    { value: "colon", label: "colon" },
    {
      value: "connective, subcutaneous and other soft tissues",
      label: "connective, subcutaneous and other soft tissues",
    },
    { value: "corpus uteri", label: "corpus uteri" },
    { value: "esophagus", label: "esophagus" },
    { value: "eye and adnexa", label: "eye and adnexa" },
    { value: "floor of mouth", label: "floor of mouth" },
    { value: "gallbladder", label: "gallbladder" },
    { value: "gum", label: "gum" },
    {
      value: "heart, mediastinum, and pleura",
      label: "heart, mediastinum, and pleura",
    },
    {
      value: "hematopoietic and reticuloendothelial systems",
      label: "hematopoietic and reticuloendothelial systems",
    },
    { value: "hypopharynx", label: "hypopharynx" },
    { value: "kidney", label: "kidney" },
    { value: "larynx", label: "larynx" },
    { value: "lip", label: "lip" },
    {
      value: "liver and intrahepatic bile ducts",
      label: "liver and intrahepatic bile ducts",
    },
    { value: "lymph nodes", label: "lymph nodes" },
    { value: "meninges", label: "meninges" },
    {
      value: "nasal cavity and middle ear",
      label: "nasal cavity and middle ear",
    },
    { value: "nasopharynx", label: "nasopharynx" },
    { value: "not reported", label: "not reported" },
    { value: "oropharynx", label: "oropharynx" },
    {
      value: "other and ill-defined digestive organs",
      label: "other and ill-defined digestive organs",
    },
    {
      value: "other and ill-defined sites in lip, oral cavity and pharynx",
      label: "other and ill-defined sites in lip, oral cavity and pharynx",
    },
    {
      value:
        "other and ill-defined sites within respiratory system and intrathoracic organs",
      label:
        "other and ill-defined sites within respiratory system and intrathoracic organs",
    },
    {
      value: "other and ill-defined sites",
      label: "other and ill-defined sites",
    },
    {
      value: "other and unspecified female genital organs",
      label: "other and unspecified female genital organs",
    },
    {
      value: "other and unspecified major salivary glands",
      label: "other and unspecified major salivary glands",
    },
    {
      value: "other and unspecified male genital organs",
      label: "other and unspecified male genital organs",
    },
    {
      value: "other and unspecified parts of biliary tract",
      label: "other and unspecified parts of biliary tract",
    },
    {
      value: "other and unspecified parts of mouth",
      label: "other and unspecified parts of mouth",
    },
    {
      value: "other and unspecified parts of tongue",
      label: "other and unspecified parts of tongue",
    },
    {
      value: "other and unspecified urinary organs",
      label: "other and unspecified urinary organs",
    },
    {
      value: "other endocrine glands and related structures",
      label: "other endocrine glands and related structures",
    },
    { value: "ovary", label: "ovary" },
    { value: "palate", label: "palate" },
    { value: "pancreas", label: "pancreas" },
    { value: "penis", label: "penis" },
    {
      value: "peripheral nerves and autonomic nervous system",
      label: "peripheral nerves and autonomic nervous system",
    },
    { value: "prostate gland", label: "prostate gland" },
    { value: "rectosigmoid junction", label: "rectosigmoid junction" },
    { value: "rectum", label: "rectum" },
    { value: "renal pelvis", label: "renal pelvis" },
    {
      value: "retroperitoneum and peritoneum",
      label: "retroperitoneum and peritoneum",
    },
    { value: "skin", label: "skin" },
    { value: "small intestine", label: "small intestine" },
    {
      value:
        "spinal cord, cranial nerves, and other parts of central nervous system",
      label:
        "spinal cord, cranial nerves, and other parts of central nervous system",
    },
    { value: "stomach", label: "stomach" },
    { value: "testis", label: "testis" },
    { value: "thymus", label: "thymus" },
    { value: "thyroid gland", label: "thyroid gland" },
    { value: "tonsil", label: "tonsil" },
    { value: "trachea", label: "trachea" },
    { value: "unknown", label: "unknown" },
    { value: "ureter", label: "ureter" },
    { value: "uterus, nos", label: "uterus, nos" },
    { value: "vagina", label: "vagina" },
    { value: "vulva", label: "vulva" },
  ];

  const primarySiteFilter = filterBox({
    title: "Primary Sites",
    data: primarySiteOptions,
    inputId: "studies-view__primary-site",
  });

  const experimentalStrategyOptions = [
    { value: "ATAC-Seq", label: "ATAC-Seq" },
    { value: "Diagnostic Slide", label: "Diagnostic Slide" },
    { value: "Genotyping Array", label: "Genotyping Array" },
    { value: "Methylation Array", label: "Methylation Array" },
    { value: "RNA-Seq", label: "RNA-Seq" },
    { value: "Targeted Sequencing", label: "Targeted Sequencing" },
    { value: "Tissue Slide", label: "Tissue Slide" },
    { value: "WGS", label: "WGS" },
    { value: "WXS", label: "WXS" },
    { value: "miRNA-Seq", label: "miRNA-Seq" },
    { value: "scRNA-Seq", label: "scRNA-Seq" },
  ];

  const experimentalStrategyFilter = filterBox({
    title: "Experimental Strategies",
    data: experimentalStrategyOptions,
    inputId: "studies-view__experimental-strategy",
  });

  const programOptions = [
    { value: "BEATAML1.0", label: "BEATAML1.0" },
    { value: "CGCI", label: "CGCI" },
    { value: "CMI", label: "CMI" },
    { value: "CPTAC", label: "CPTAC" },
    { value: "CTSP", label: "CTSP" },
    { value: "FM", label: "FM" },
    { value: "GDC", label: "GDC" },
    { value: "GENIE", label: "GENIE" },
    { value: "HCMI", label: "HCMI" },
    { value: "MMRF", label: "MMRF" },
    { value: "NCICCR", label: "NCICCR" },
    { value: "OHSU", label: "OHSU" },
    { value: "ORGANOID", label: "ORGANOID" },
    { value: "TARGET", label: "TARGET" },
    { value: "TCGA", label: "TCGA" },
    { value: "VAREPOP", label: "VAREPOP" },
    { value: "WCDT", label: "WCDT" },
  ];

  const programFilter = filterBox({
    title: "Program",
    data: programOptions,
    inputId: "studies-view__program",
  });

  const sortOptions = [
    { value: "a-z", label: "Sort: A-Z" },
    { value: "z-a", label: "Sort: Z-A" },
  ];
  const sortFilter = (
    <Select
      inputId="studies-view__sort"
      options={sortOptions}
      placeholder="Sort"
      isMulti={false}
      defaultValue={sortOptions[0]}
    />
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <div className="w-72">{programFilter}</div>
        <div className="w-72">{diseaseTypeFilter}</div>
        <div className="w-72">{primarySiteFilter}</div>
        <div className="w-72">{experimentalStrategyFilter}</div>
        <div className="flex-grow" />
      </div>
      <div className="flex flex-col w-72 gap-y-4">
        <Button>Selected Cohorts: None</Button>
        <Button
          className="px-2 py-1
    border rounded
    bg-primary-lighter text-primary-content"
        >
          Explore Selected Cohorts In...
        </Button>
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="w-40">{sortFilter}</div>
        <div className="flex-grow">
          <Search />
        </div>
      </div>
      <div className="flex-grow">
        <Studies projects={projects} onClickStudy={setCurrentStudy} />
      </div>
    </div>
  );
};

interface StudiesProps {
  readonly projects?: ReadonlyArray<ProjectDefaults>;
  readonly onClickStudy?: (string) => void;
}

const Studies: React.FC<StudiesProps> = ({
  projects,
  onClickStudy = () => {
    return;
  },
}: StudiesProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects?.map((project) => (
        <Study
          project={project}
          key={project.project_id}
          onClick={() => onClickStudy(project.project_id)}
        />
      ))}
    </div>
  );
};

interface StudyProps {
  readonly project: ProjectDefaults;
  readonly onClick: () => void;
}

const Study: React.FC<StudyProps> = (props: StudyProps) => {
  const { project_id } = props.project;

  const mainProject = project_id.split("-")[0];
  const projectLogoPath = `/logos/${mainProject}_logo.png`;

  /* thoughts on checking if images exist
  try {
    fetch(projectLogoPath, {method: 'HEAD'})
      .then((response)=>{
        if (response.status !== 200) {
          projectLogoPath = null;
        }
      });
  }  catch (err) {
    projectLogoPath = null;
  }
  */
  const [isFacetView, setIsFacetView] = useState(true);
  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  return (
    <div
      key={project_id}
      className={
        "group h-250 border border-base-lighter flex flex-col bg-base-lightest shadow-md"
      }
    >
      <div className="bg-base-lightest flex flex-row">
        <div className="flex-grow text-center pl-4">{props.project.name}</div>
        <button className="p-2" onClick={toggleFlip}>
          <MdFlip title="Flip Card" />
        </button>
        <button className="p-2 has-tooltip relative">
          <BsQuestionCircleFill />
          <div className="inline-block tooltip absolute bg-base-lightest p-4 border rounded top-0">
            Tooltip text
          </div>
        </button>
      </div>
      <div
        className={`relative flip-card${
          isFacetView ? "" : " flip-card-flipped"
        }`}
      >
        <div className="w-auto h-auto card-face bg-base-lightest grid grid-cols-2flex1 m-4 mt-2">
          {projectLogoPath ? (
            <div className="max-h-40 relative">
              <Image
                src={projectLogoPath}
                layout="fill"
                alt={`${project_id} logo`}
                style={{ objectFit: "contain" }}
                className="nextImageFillFix"
              />
            </div>
          ) : null}
          <label className="p-4">
            <input type="checkbox" className="mx-2" />
            <span className="pt-2">Select</span>
          </label>
          <div className="flex flex-col">
            <div className="py-4">
              {props.project.disease_type?.length > 0
                ? props.project.disease_type.length === 1
                  ? props.project.disease_type[0]
                  : `${props.project.disease_type.length} Disease Types`
                : ""}
            </div>

            <div className="">
              {props.project.primary_site?.length > 0
                ? props.project.primary_site.length === 1
                  ? props.project.primary_site[0]
                  : `${props.project.primary_site.length} Primary Sites`
                : ""}
            </div>
          </div>
          <div className="flex flex-col justify-center px-4">
            <StudiesButton>1,098 Cases</StudiesButton>
            <Button>33,766 Files</Button>
          </div>
        </div>
        <div className="card-face card-back rounded-b-md bg-base-lightest">
          <FacetChart
            field={"test"}
            marginBottom={40}
            showXLabels={true}
            showTitle={false}
            orientation="h"
            maxBins={16}
          />
        </div>
      </div>
    </div>
  );
};

const Search: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row justify-center">
      <div className="sm:w-1/2  rounded-full border border-base flex flex-row pr-4 bg-base-lightest">
        <div className="flex flex-none fill-current text-prinary-content-darkest align-text-bottom pl-2">
          <Image src="/Search_Icon.svg" width={16} height={16} />
        </div>
        <input
          type="text"
          placeholder="search"
          className="flex-grow form-input pl-2 pr-0 border-none h-6 focus:ring-0"
        />
      </div>
    </div>
  );
};
