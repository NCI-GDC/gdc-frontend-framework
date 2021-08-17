import { Project, useProjects } from "@gff/core";
import { Search, Studies } from "../user-flow/common";
import { Option, Select, SelectProps } from "../../components/Select";
import { GroupTypeBase } from "react-select";

const DLBCL: Project = {
  projectId: "DLBCL",
  name: "DLBCL",
};

export interface ContextualStudiesViewProps {
  readonly setCurrentStudy: (name: string) => void;
  readonly exploreLeft?: React.ReactNode;
  readonly exploreRight?: React.ReactNode;
}

export const ContextualStudiesView: React.FC<ContextualStudiesViewProps> = (
  props: ContextualStudiesViewProps,
) => {
  const { data } = useProjects({ size: 100 });

  return <StudiesView projects={data ? [DLBCL, ...data] : []} {...props} />;
};

export interface StudiesViewProps {
  readonly projects: ReadonlyArray<Project>;
  readonly setCurrentStudy: (name: string) => void;
  readonly exploreLeft?: React.ReactNode;
  readonly exploreRight?: React.ReactNode;
}

export const StudiesView: React.FC<StudiesViewProps> = ({
  projects,
  setCurrentStudy,
  exploreLeft,
  exploreRight,
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
  const diseaseTypeFilter = (
    <Select
      inputId="studies-view__disease-type"
      options={diseaseTypeOptions}
      isMulti={true}
      placeholder="Select Disease Types"
    />
  );

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

  const primarySiteProps: SelectProps<Option, true, GroupTypeBase<Option>> = {
    inputId: "studies-view__primary-site",
    options: primarySiteOptions,
    isMulti: true,
    placeholder: "Select Primary Sites",
  };

  const primarySiteFilter = <Select {...primarySiteProps} />;

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

  const experimentalStrategyFilter = (
    <Select
      inputId="studies-view__experimental-strategy"
      options={experimentalStrategyOptions}
      isMulti={true}
      placeholder="Select Experimental Strategies"
    />
  );

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
    />
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Search />
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="w-72">{diseaseTypeFilter}</div>
        <div className="w-72">{primarySiteFilter}</div>
        <div className="w-72">{experimentalStrategyFilter}</div>
        <div className="flex-grow" />
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="w-40">{sortFilter}</div>
        <div className="flex-grow" />
        <div className="">{exploreLeft}</div>
        <div className="">{exploreRight}</div>
      </div>
      <div className="flex-grow">
        <Studies projects={projects} onClickStudy={setCurrentStudy} />
      </div>
    </div>
  );
};
