import { HUMAN_BODY_MAPPER } from "../constants";
import { processData } from "../bodyplotSlice";
import {
  receivedBodyplotData,
  expectedProcessedData,
} from "./bodyplotSliceTestData";

describe("test processData for Bodyplot response", () => {
  test("processData", () => {
    const results = processData(
      receivedBodyplotData.data.viewer.repository.cases.aggregations
        .primary_site.buckets,
    );
    expect(results).toEqual(expectedProcessedData);
  });
});

describe("test indexing human body mapper", () => {
  test("indexing human body mapper byPrimarySite", () => {
    expect(HUMAN_BODY_MAPPER("byPrimarySite")).toEqual({
      "accessory sinuses": ["Head and Neck"],
      "adrenal gland": ["Adrenal Gland"],
      "anus and anal canal": ["Other and Ill-defined Sites"],
      "base of tongue": ["Head and Neck"],
      bladder: ["Bladder"],
      "bones, joints and articular cartilage of limbs": ["Bone"],
      "bones, joints and articular cartilage of other and unspecified sites": [
        "Bone",
      ],
      brain: ["Brain"],
      breast: ["Breast"],
      "bronchus and lung": ["Lung"],
      "cervix uteri": ["Cervix"],
      colon: ["Colorectal"],
      "connective, subcutaneous and other soft tissues": ["Soft Tissue"],
      "corpus uteri": ["Uterus"],
      esophagus: ["Esophagus"],
      "eye and adnexa": ["Eye"],
      "floor of mouth": ["Head and Neck"],
      gallbladder: ["Other and Ill-defined Sites"],
      gum: ["Head and Neck"],
      "heart, mediastinum, and pleura": ["Pleura"],
      "hematopoietic and reticuloendothelial systems": [
        "Bone Marrow and Blood",
      ],
      hypopharynx: ["Head and Neck"],
      kidney: ["Kidney"],
      larynx: ["Head and Neck"],
      lip: ["Head and Neck"],
      "liver and intrahepatic bile ducts": ["Liver"],
      "lymph nodes": ["Lymph Nodes"],
      meninges: ["Nervous System"],
      "nasal cavity and middle ear": ["Head and Neck"],
      nasopharynx: ["Head and Neck"],
      "not reported": ["Not Reported"],
      oropharynx: ["Head and Neck"],
      "other and ill-defined digestive organs": ["Other and Ill-defined Sites"],
      "other and ill-defined sites": ["Other and Ill-defined Sites"],
      "other and ill-defined sites in lip, oral cavity and pharynx": [
        "Head and Neck",
      ],
      "other and ill-defined sites within respiratory system and intrathoracic organs":
        ["Other and Ill-defined Sites"],
      "other and unspecified female genital organs": [
        "Other and Ill-defined Sites",
      ],
      "other and unspecified major salivary glands": ["Head and Neck"],
      "other and unspecified male genital organs": [
        "Other and Ill-defined Sites",
      ],
      "other and unspecified parts of biliary tract": ["Bile Duct"],
      "other and unspecified parts of mouth": ["Head and Neck"],
      "other and unspecified parts of tongue": ["Head and Neck"],
      "other and unspecified urinary organs": ["Other and Ill-defined Sites"],
      "other endocrine glands and related structures": [
        "Other and Ill-defined Sites",
      ],
      ovary: ["Ovary"],
      palate: ["Head and Neck"],
      pancreas: ["Pancreas"],
      "parotid gland": ["Head and Neck"],
      penis: ["Other and Ill-defined Sites"],
      "peripheral nerves and autonomic nervous system": ["Nervous System"],
      placenta: ["Other and Ill-defined Sites"],
      "prostate gland": ["Prostate"],
      "pyriform sinus": ["Head and Neck"],
      "rectosigmoid junction": ["Colorectal"],
      rectum: ["Colorectal"],
      "renal pelvis": ["Other and Ill-defined Sites"],
      "retroperitoneum and peritoneum": ["Other and Ill-defined Sites"],
      skin: ["Skin"],
      "small intestine": ["Stomach"],
      "spinal cord, cranial nerves, and other parts of central nervous system":
        ["Nervous System"],
      stomach: ["Stomach"],
      testis: ["Testis"],
      thymus: ["Thymus"],
      "thyroid gland": ["Thyroid"],
      tonsil: ["Head and Neck"],
      trachea: ["Head and Neck"],
      unknown: ["Not Reported"],
      "unknown primary site": ["Other and Ill-defined Sites"],
      ureter: ["Other and Ill-defined Sites"],
      "uterus, nos": ["Uterus"],
      vagina: ["Other and Ill-defined Sites"],
      vulva: ["Other and Ill-defined Sites"],
    });
  });
});
