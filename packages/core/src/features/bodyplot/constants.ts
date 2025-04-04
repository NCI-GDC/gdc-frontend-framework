export type BodyplotDataElement = {
  [key: string]: string[];
  byPrimarySite: string[];
  byTissueOrOrganOfOrigin: string[];
};

export type BodyPlotDataKey =
  | "Adrenal Gland"
  | "Bile Duct"
  | "Bladder"
  | "Bone"
  | "Bone Marrow and Blood"
  | "Brain"
  | "Breast"
  | "Cervix"
  | "Colorectal"
  | "Esophagus"
  | "Eye"
  | "Head and Neck"
  | "Kidney"
  | "Liver"
  | "Lung"
  | "Lymph Nodes"
  | "Nervous System"
  | "Not Reported"
  | "Other and Ill-defined Sites"
  | "Ovary"
  | "Pancreas"
  | "Pleura"
  | "Prostate"
  | "Skin"
  | "Soft Tissue"
  | "Stomach"
  | "Testis"
  | "Thymus"
  | "Thyroid"
  | "Uterus";

type BodyPlotData = Record<BodyPlotDataKey, BodyplotDataElement>;

export const HUMAN_BODY_MAPPINGS: BodyPlotData = {
  "Adrenal Gland": {
    byPrimarySite: ["Adrenal gland"],
    byTissueOrOrganOfOrigin: [
      "Adrenal gland, NOS",
      "Cortex of adrenal gland",
      "Medulla of adrenal gland",
    ],
  },
  "Bile Duct": {
    byPrimarySite: ["Other and unspecified parts of biliary tract"],
    byTissueOrOrganOfOrigin: [
      "Ampulla of Vater",
      "Biliary tract, NOS",
      "Extrahepatic bile duct",
      "Overlapping lesion of biliary tract",
    ],
  },
  Bladder: {
    byPrimarySite: ["Bladder"],
    byTissueOrOrganOfOrigin: [
      "Anterior wall of bladder",
      "Bladder neck",
      "Bladder, NOS",
      "Dome of bladder",
      "Lateral wall of bladder",
      "Overlapping lesion of bladder",
      "Posterior wall of bladder",
      "Trigone of bladder",
      "Urachus",
      "Ureteric orifice",
    ],
  },
  Bone: {
    byPrimarySite: [
      "Bones, joints and articular cartilage of limbs",
      "Bones, joints and articular cartilage of other and unspecified sites",
    ],
    byTissueOrOrganOfOrigin: [
      "Bone of limb, NOS",
      "Bone, NOS",
      "Bones of skull and face and associated joints",
      "Long bones of lower limb and associated joints",
      "Long bones of upper limb, scapula and associated joints",
      "Mandible",
      "Overlapping lesion of bones, joints and articular cartilage of limbs",
      "Overlapping lesion of bones, joints and articular cartilage",
      "Pelvic bones, sacrum, coccyx and associated joints",
      "Pelvis, NOS",
      "Rib, sternum, clavicle and associated joints",
      "Short bones of lower limb and associated joints",
      "Short bones of upper limb and associated joints",
      "Vertebral column",
    ],
  },
  "Bone Marrow and Blood": {
    byPrimarySite: ["Hematopoietic and reticuloendothelial systems"],
    byTissueOrOrganOfOrigin: [
      "Blood",
      "Bone marrow",
      "Hematopoietic system, NOS",
      "Reticuloendothelial system, NOS",
      "Spleen",
    ],
  },
  Brain: {
    byPrimarySite: ["Brain"],
    byTissueOrOrganOfOrigin: [
      "Brain stem",
      "Brain, NOS",
      "Cerebellum, NOS",
      "Cerebrum",
      "Frontal lobe",
      "Occipital lobe",
      "Overlapping lesion of brain",
      "Parietal lobe",
      "Temporal lobe",
      "Ventricle, NOS",
    ],
  },
  Breast: {
    byPrimarySite: ["Breast"],
    byTissueOrOrganOfOrigin: [
      "Axillary tail of breast",
      "Breast, NOS",
      "Central portion of breast",
      "Lower-inner quadrant of breast",
      "Lower-outer quadrant of breast",
      "Nipple",
      "Overlapping lesion of breast",
      "Upper-inner quadrant of breast",
      "Upper-outer quadrant of breast",
    ],
  },
  Cervix: {
    byPrimarySite: ["Cervix uteri"],
    byTissueOrOrganOfOrigin: [
      "Cervix uteri",
      "Endocervix",
      "Exocervix",
      "Overlapping lesion of cervix uteri",
    ],
  },
  Colorectal: {
    byPrimarySite: ["Colon", "Rectosigmoid junction", "Rectum"],
    byTissueOrOrganOfOrigin: [
      "Appendix",
      "Ascending colon",
      "Cecum",
      "Colon, NOS",
      "Descending colon",
      "Hepatic flexure of colon",
      "Overlapping lesion of colon",
      "Rectosigmoid junction",
      "Rectum, NOS",
      "Sigmoid colon",
      "Splenic flexure of colon",
      "Transverse colon",
    ],
  },
  Esophagus: {
    byPrimarySite: ["Esophagus"],
    byTissueOrOrganOfOrigin: [
      "Abdominal esophagus",
      "Cervical esophagus",
      "Esophagus, NOS",
      "Lower third of esophagus",
      "Middle third of esophagus",
      "Overlapping lesion of esophagus",
      "Thoracic esophagus",
      "Upper third of esophagus",
    ],
  },
  Eye: {
    byPrimarySite: ["Eye and adnexa"],
    byTissueOrOrganOfOrigin: [
      "Choroid",
      "Ciliary body",
      "Conjunctiva",
      "Cornea, NOS",
      "Eye, NOS",
      "Lacrimal gland",
      "Orbit, NOS",
      "Overlapping lesion of eye and adnexa",
      "Retina",
    ],
  },
  "Head and Neck": {
    byPrimarySite: [
      "Accessory sinuses",
      "Base of tongue",
      "Floor of mouth",
      "Gum",
      "Hypopharynx",
      "Larynx",
      "Lip",
      "Nasal cavity and middle ear",
      "Nasopharynx",
      "Oropharynx",
      "Other and ill-defined sites in lip, oral cavity and pharynx",
      "Other and unspecified major salivary glands",
      "Other and unspecified parts of mouth",
      "Other and unspecified parts of tongue",
      "Palate",
      "Parotid gland",
      "Pyriform sinus",
      "Tonsil",
      "Trachea",
    ],
    byTissueOrOrganOfOrigin: [
      "Accessory sinus, NOS",
      "Anterior 2/3 of tongue, NOS",
      "Anterior floor of mouth",
      "Anterior surface of epiglottis",
      "Anterior wall of nasopharynx",
      "Base of tongue, NOS",
      "Border of tongue",
      "Branchial cleft",
      "Cheek mucosa",
      "Commissure of lip",
      "Dorsal surface of tongue, NOS",
      "Ethmoid sinus",
      "External lip, NOS",
      "External lower lip",
      "External upper lip",
      "Floor of mouth, NOS",
      "Frontal sinus",
      "Glottis",
      "Gum, NOS",
      "Hard palate",
      "Head, face or neck, NOS",
      "Hypopharyngeal aspect of aryepiglottic fold",
      "Hypopharynx, NOS",
      "Laryngeal cartilage",
      "Larynx, NOS",
      "Lateral floor of mouth",
      "Lateral wall of nasopharynx",
      "Lateral wall of oropharynx",
      "Lingual tonsil",
      "Lip, NOS",
      "Lower gum",
      "Major salivary gland, NOS",
      "Maxillary sinus",
      "Middle ear",
      "Mouth, NOS",
      "Mucosa of lip, NOS",
      "Mucosa of lower lip",
      "Mucosa of upper lip",
      "Nasal cavity",
      "Nasopharynx, NOS",
      "Oropharynx, NOS",
      "Overlapping lesion of accessory sinuses",
      "Overlapping lesion of floor of mouth",
      "Overlapping lesion of hypopharynx",
      "Overlapping lesion of larynx",
      "Overlapping lesion of lip, oral cavity and pharynx",
      "Overlapping lesion of lip",
      "Overlapping lesion of major salivary glands",
      "Overlapping lesion of nasopharynx",
      "Overlapping lesion of other and unspecified parts of mouth",
      "Overlapping lesion of palate",
      "Overlapping lesion of tongue",
      "Overlapping lesion of tonsil",
      "Overlapping lesions of oropharynx",
      "Palate, NOS",
      "Parotid gland",
      "Pharynx, NOS",
      "Postcricoid region",
      "Posterior wall of hypopharynx",
      "Posterior wall of nasopharynx",
      "Posterior wall of oropharynx",
      "Pyriform sinus",
      "Retromolar area",
      "Soft palate, NOS",
      "Sphenoid sinus",
      "Subglottis",
      "Sublingual gland",
      "Submandibular gland",
      "Superior wall of nasopharynx",
      "Supraglottis",
      "Tongue, NOS",
      "Tonsil, NOS",
      "Tonsillar fossa",
      "Tonsillar pillar",
      "Trachea",
      "Upper Gum",
      "Uvula",
      "Vallecula",
      "Ventral surface of tongue, NOS",
      "Vestibule of mouth",
      "Waldeyer ring",
    ],
  },
  Kidney: {
    byPrimarySite: ["Kidney"],
    byTissueOrOrganOfOrigin: ["Kidney, NOS"],
  },
  Liver: {
    byPrimarySite: ["Liver and intrahepatic bile ducts"],
    byTissueOrOrganOfOrigin: ["intrahepatic bile duct", "Liver"],
  },
  Lung: {
    byPrimarySite: ["Bronchus and lung"],
    byTissueOrOrganOfOrigin: [
      "Lower lobe, lung",
      "Lung, NOS",
      "Main bronchus",
      "Middle lobe, lung",
      "Overlapping lesion of lung",
      "Upper lobe, lung",
    ],
  },
  "Lymph Nodes": {
    byPrimarySite: ["Lymph nodes"],
    byTissueOrOrganOfOrigin: [
      "Intra-abdominal lymph nodes",
      "Intrathoracic lymph nodes",
      "Lymph node, NOS",
      "Lymph nodes of axilla or arm",
      "Lymph nodes of head, face and neck",
      "Lymph nodes of inguinal region or leg",
      "Lymph nodes of multiple regions",
      "Pelvic lymph nodes",
    ],
  },
  "Nervous System": {
    byPrimarySite: [
      "Meninges",
      "Peripheral nerves and autonomic nervous system",
      "Spinal cord, cranial nerves, and other parts of central nervous system",
    ],
    byTissueOrOrganOfOrigin: [
      "Acoustic nerve",
      "Autonomic nervous system, NOS",
      "Cauda equina",
      "Cerebral meninges",
      "Cranial nerve, NOS",
      "Meninges, NOS",
      "Nervous system, NOS",
      "Olfactory nerve",
      "Optic nerve",
      "Overlapping lesion of brain and central nervous system",
      "Overlapping lesion of peripheral nerves and autonomic nervous system",
      "Peripheral nerves and autonomic nervous system of abdomen",
      "Peripheral nerves and autonomic nervous system of head, face, and neck",
      "Peripheral nerves and autonomic nervous system of lower limb and hip",
      "Peripheral nerves and autonomic nervous system of pelvis",
      "Peripheral nerves and autonomic nervous system of thorax",
      "Peripheral nerves and autonomic nervous system of trunk, NOS",
      "Peripheral nerves and autonomic nervous system of upper limb and shoulder",
      "Spinal cord",
      "Spinal meninges",
    ],
  },
  "Not Reported": {
    byPrimarySite: ["Not Reported", "unknown"],
    byTissueOrOrganOfOrigin: ["Not Reported", "unknown"],
  },
  "Other and Ill-defined Sites": {
    byPrimarySite: [
      "Anus and anal canal",
      "Gallbladder",
      "Other and ill-defined digestive organs",
      "Other and ill-defined sites within respiratory system and intrathoracic organs",
      "Other and ill-defined sites",
      "Other and unspecified female genital organs",
      "Other and unspecified male genital organs",
      "Other and unspecified urinary organs",
      "Other endocrine glands and related structures",
      "Penis",
      "Placenta",
      "Renal pelvis",
      "Retroperitoneum and peritoneum",
      "Unknown primary site",
      "Ureter",
      "Vagina",
      "Vulva",
    ],
    byTissueOrOrganOfOrigin: [
      "Abdomen, NOS",
      "Anal canal",
      "Anus, NOS",
      "Aortic body and other paraganglia",
      "Body of penis",
      "Broad ligament",
      "Carotid body",
      "Clitoris",
      "Cloacogenic zone",
      "Craniopharyngeal duct",
      "Endocrine gland, NOS",
      "Epididymis",
      "Fallopian tube",
      "Female genital tract, NOS",
      "Gallbladder",
      "Gastrointestinal tract, NOS",
      "Glans penis",
      "Ill-defined sites within respiratory system",
      "Intestinal tract, NOS",
      "Labium majus",
      "Labium minus",
      "Lower limb, NOS",
      "Male genital organs, NOS",
      "Other ill-defined sites",
      "Other specified parts of female genital organs",
      "Other specified parts of male genital organs",
      "Overlapping lesion of digestive system",
      "Overlapping lesion of endocrine glands and related structures",
      "Overlapping lesion of female genital organs",
      "Overlapping lesion of ill-defined sites",
      "Overlapping lesion of male genital organs",
      "Overlapping lesion of penis",
      "Overlapping lesion of rectum, anus and anal canal",
      "Overlapping lesion of respiratory system and intrathoracic organs",
      "Overlapping lesion of retroperitoneum and peritoneum",
      "Overlapping lesion of urinary organs",
      "Overlapping lesion of vulva",
      "Parametrium",
      "Parathyroid gland",
      "Paraurethral gland",
      "Penis, NOS",
      "Peritoneum, NOS",
      "Pineal gland",
      "Pituitary gland",
      "Placenta",
      "Prepuce",
      "Renal pelvis",
      "Retroperitoneum",
      "Round ligament",
      "Scrotum, NOS",
      "Specified parts of peritoneum",
      "Spermatic cord",
      "Thorax, NOS",
      "Unknown primary site",
      "Upper limb, NOS",
      "Upper respiratory tract, NOS",
      "Ureter",
      "Urethra",
      "Urinary system, NOS",
      "Uterine adnexa",
      "Vagina, NOS",
      "Vulva, NOS",
    ],
  },
  Ovary: {
    byPrimarySite: ["Ovary"],
    byTissueOrOrganOfOrigin: ["Ovary"],
  },
  Pancreas: {
    byPrimarySite: ["Pancreas"],
    byTissueOrOrganOfOrigin: [
      "Body of pancreas",
      "Head of pancreas",
      "Islets of Langerhans",
      "Other specified parts of pancreas",
      "Overlapping lesion of pancreas",
      "Pancreas, NOS",
      "Pancreatic duct",
      "Tail of pancreas",
    ],
  },
  Pleura: {
    byPrimarySite: ["Heart, mediastinum, and pleura"],
    byTissueOrOrganOfOrigin: [
      "Anterior mediastinum",
      "Heart",
      "Mediastinum, NOS",
      "Overlapping lesion of heart, mediastinum and pleura",
      "Pleura, NOS",
      "Posterior mediastinum",
    ],
  },
  Prostate: {
    byPrimarySite: ["Prostate gland"],
    byTissueOrOrganOfOrigin: ["Prostate gland"],
  },
  Skin: {
    byPrimarySite: ["Skin"],
    byTissueOrOrganOfOrigin: [
      "External ear",
      "Eyelid",
      "Overlapping lesion of skin",
      "Skin of lip, NOS",
      "Skin of lower limb and hip",
      "Skin of other and unspecified parts of face",
      "Skin of scalp and neck",
      "Skin of trunk",
      "Skin of upper limb and shoulder",
      "Skin, NOS",
    ],
  },
  "Soft Tissue": {
    byPrimarySite: ["Connective, subcutaneous and other soft tissues"],
    byTissueOrOrganOfOrigin: [
      "Connective, Subcutaneous and other soft tissues of abdomen",
      "Connective, Subcutaneous and other soft tissues of head, face, and neck",
      "Connective, Subcutaneous and other soft tissues of lower limb and hip",
      "Connective, Subcutaneous and other soft tissues of pelvis",
      "Connective, Subcutaneous and other soft tissues of thorax",
      "Connective, Subcutaneous and other soft tissues of trunk, NOS",
      "Connective, Subcutaneous and other soft tissues of upper limb and shoulder",
      "Connective, Subcutaneous and other soft tissues, NOS",
      "Overlapping lesion of connective, subcutaneous and other soft tissues",
    ],
  },
  Stomach: {
    byPrimarySite: ["Small intestine", "Stomach"],
    byTissueOrOrganOfOrigin: [
      "Body of stomach",
      "Cardia, NOS",
      "Duodenum",
      "Fundus of stomach",
      "Gastric antrum",
      "Greater curvature of stomach, NOS",
      "Ileum",
      "Jejunum",
      "Lesser curvature of stomach, NOS",
      "Meckel diverticulum",
      "Overlapping lesion of small intestine",
      "Overlapping lesion of stomach",
      "Pylorus",
      "Small intestine, NOS",
      "Stomach, NOS",
    ],
  },
  Testis: {
    byPrimarySite: ["Testis"],
    byTissueOrOrganOfOrigin: [
      "Descended testis",
      "Testis, NOS",
      "Undescended testis",
    ],
  },
  Thymus: {
    byPrimarySite: ["Thymus"],
    byTissueOrOrganOfOrigin: ["Thymus"],
  },
  Thyroid: {
    byPrimarySite: ["Thyroid gland"],
    byTissueOrOrganOfOrigin: ["Thyroid gland"],
  },
  Uterus: {
    byPrimarySite: ["Corpus uteri", "Uterus, NOS"],
    byTissueOrOrganOfOrigin: [
      "Corpus uteri",
      "Endometrium",
      "Fundus uteri",
      "Isthmus uteri",
      "Myometrium",
      "Overlapping lesion of corpus uteri",
      "Uterus, NOS",
    ],
  },
};

export const HUMAN_BODY_MAPPER = (
  category: "byPrimarySite" | "byTissueOrOrganOfOrigin",
): Record<string, BodyPlotDataKey[]> =>
  Object.entries(HUMAN_BODY_MAPPINGS).reduce(
    (mainAcc: Record<string, string[]>, [sapiensLabel, byCategories]) => ({
      ...mainAcc,
      ...byCategories[category].reduce(
        (acc, categoryKey: string) => ({
          ...acc,
          [categoryKey.toLowerCase() || sapiensLabel.toLowerCase()]: mainAcc[
            categoryKey.toLowerCase() || sapiensLabel.toLowerCase()
          ]
            ? [
                ...mainAcc[
                  categoryKey.toLowerCase() || sapiensLabel.toLowerCase()
                ],
                sapiensLabel,
              ]
            : [sapiensLabel],
        }),
        {},
      ),
    }),
    {},
  );

export const HUMAN_BODY_SITES_MAP = HUMAN_BODY_MAPPER("byPrimarySite");
export const HUMAN_BODY_TOOS_MAP = HUMAN_BODY_MAPPER("byTissueOrOrganOfOrigin");

export const HUMAN_BODY_ALL_ALLOWED_SITES = Object.keys(
  HUMAN_BODY_MAPPINGS,
).filter(
  (site) => !["Not Reported", "Other and Ill-defined Sites"].includes(site),
);
