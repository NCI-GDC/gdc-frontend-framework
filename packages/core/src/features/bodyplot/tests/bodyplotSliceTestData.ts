export const receivedBodyplotData = {
  data: {
    viewer: {
      repository: {
        cases: {
          aggregations: {
            primary_site: {
              buckets: [
                {
                  doc_count: 12213,
                  key: "bronchus and lung",
                },
                {
                  doc_count: 9594,
                  key: "hematopoietic and reticuloendothelial systems",
                },
                {
                  doc_count: 9123,
                  key: "breast",
                },
                {
                  doc_count: 6920,
                  key: "colon",
                },
                {
                  doc_count: 3703,
                  key: "spinal cord, cranial nerves, and other parts of central nervous system",
                },
                {
                  doc_count: 3462,
                  key: "kidney",
                },
                {
                  doc_count: 3402,
                  key: "ovary",
                },
                {
                  doc_count: 3233,
                  key: "unknown",
                },
                {
                  doc_count: 2889,
                  key: "skin",
                },
                {
                  doc_count: 2753,
                  key: "pancreas",
                },
                {
                  doc_count: 2391,
                  key: "prostate gland",
                },
                {
                  doc_count: 1898,
                  key: "uterus, nos",
                },
                {
                  doc_count: 1881,
                  key: "thyroid gland",
                },
                {
                  doc_count: 1725,
                  key: "bladder",
                },
                {
                  doc_count: 1611,
                  key: "liver and intrahepatic bile ducts",
                },
                {
                  doc_count: 1574,
                  key: "connective, subcutaneous and other soft tissues",
                },
                {
                  doc_count: 1456,
                  key: "brain",
                },
                {
                  doc_count: 1403,
                  key: "esophagus",
                },
                {
                  doc_count: 1355,
                  key: "stomach",
                },
                {
                  doc_count: 1189,
                  key: "other and ill-defined sites",
                },
                {
                  doc_count: 1109,
                  key: "rectum",
                },
                {
                  doc_count: 915,
                  key: "cervix uteri",
                },
                {
                  doc_count: 851,
                  key: "adrenal gland",
                },
                {
                  doc_count: 792,
                  key: "corpus uteri",
                },
                {
                  doc_count: 720,
                  key: "other and ill-defined digestive organs",
                },
                {
                  doc_count: 706,
                  key: "heart, mediastinum, and pleura",
                },
                {
                  doc_count: 616,
                  key: "other and unspecified major salivary glands",
                },
                {
                  doc_count: 542,
                  key: "testis",
                },
                {
                  doc_count: 538,
                  key: "lymph nodes",
                },
                {
                  doc_count: 456,
                  key: "bones, joints and articular cartilage of other and unspecified sites",
                },
                {
                  doc_count: 418,
                  key: "peripheral nerves and autonomic nervous system",
                },
                {
                  doc_count: 384,
                  key: "retroperitoneum and peritoneum",
                },
                {
                  doc_count: 361,
                  key: "other and ill-defined sites in lip, oral cavity and pharynx",
                },
                {
                  doc_count: 314,
                  key: "not reported",
                },
                {
                  doc_count: 306,
                  key: "thymus",
                },
                {
                  doc_count: 270,
                  key: "small intestine",
                },
                {
                  doc_count: 268,
                  key: "bones, joints and articular cartilage of limbs",
                },
                {
                  doc_count: 265,
                  key: "gallbladder",
                },
                {
                  doc_count: 243,
                  key: "meninges",
                },
                {
                  doc_count: 235,
                  key: "anus and anal canal",
                },
                {
                  doc_count: 227,
                  key: "other and unspecified parts of biliary tract",
                },
                {
                  doc_count: 222,
                  key: "eye and adnexa",
                },
                {
                  doc_count: 217,
                  key: "other and unspecified urinary organs",
                },
                {
                  doc_count: 194,
                  key: "oropharynx",
                },
                {
                  doc_count: 182,
                  key: "other endocrine glands and related structures",
                },
                {
                  doc_count: 169,
                  key: "larynx",
                },
                {
                  doc_count: 163,
                  key: "other and unspecified female genital organs",
                },
                {
                  doc_count: 133,
                  key: "other and unspecified parts of tongue",
                },
                {
                  doc_count: 101,
                  key: "nasopharynx",
                },
                {
                  doc_count: 80,
                  key: "rectosigmoid junction",
                },
                {
                  doc_count: 72,
                  key: "vagina",
                },
                {
                  doc_count: 56,
                  key: "floor of mouth",
                },
                {
                  doc_count: 46,
                  key: "tonsil",
                },
                {
                  doc_count: 43,
                  key: "other and unspecified parts of mouth",
                },
                {
                  doc_count: 40,
                  key: "nasal cavity and middle ear",
                },
                {
                  doc_count: 33,
                  key: "penis",
                },
                {
                  doc_count: 25,
                  key: "hypopharynx",
                },
                {
                  doc_count: 24,
                  key: "base of tongue",
                },
                {
                  doc_count: 15,
                  key: "ureter",
                },
                {
                  doc_count: 11,
                  key: "gum",
                },
                {
                  doc_count: 10,
                  key: "vulva",
                },
                {
                  doc_count: 9,
                  key: "lip",
                },
                {
                  doc_count: 7,
                  key: "trachea",
                },
                {
                  doc_count: 5,
                  key: "palate",
                },
                {
                  doc_count: 2,
                  key: "other and ill-defined sites within respiratory system and intrathoracic organs",
                },
                {
                  doc_count: 1,
                  key: "other and unspecified male genital organs",
                },
                {
                  doc_count: 1,
                  key: "renal pelvis",
                },
              ],
            },
          },
        },
      },
    },
  },
};

export const expectedProcessedData = [
  {
    allPrimarySites: ["Bronchus and lung"],
    caseCount: 12213,
    key: "Lung",
  },
  {
    allPrimarySites: ["Hematopoietic and reticuloendothelial systems"],
    caseCount: 9594,
    key: "Bone Marrow and Blood",
  },
  {
    allPrimarySites: ["Breast"],
    caseCount: 9123,
    key: "Breast",
  },
  {
    allPrimarySites: ["Colon", "Rectosigmoid junction", "Rectum"],
    caseCount: 8109,
    key: "Colorectal",
  },
  {
    allPrimarySites: [
      "Meninges",
      "Peripheral nerves and autonomic nervous system",
      "Spinal cord, cranial nerves, and other parts of central nervous system",
    ],
    caseCount: 4364,
    key: "Nervous System",
  },
  {
    allPrimarySites: ["Kidney"],
    caseCount: 3462,
    key: "Kidney",
  },
  {
    allPrimarySites: ["Ovary"],
    caseCount: 3402,
    key: "Ovary",
  },
  {
    allPrimarySites: ["Skin"],
    caseCount: 2889,
    key: "Skin",
  },
  {
    allPrimarySites: ["Pancreas"],
    caseCount: 2753,
    key: "Pancreas",
  },
  {
    allPrimarySites: ["Prostate gland"],
    caseCount: 2391,
    key: "Prostate",
  },
  {
    allPrimarySites: ["Corpus uteri", "Uterus, NOS"],
    caseCount: 2690,
    key: "Uterus",
  },
  {
    allPrimarySites: ["Thyroid gland"],
    caseCount: 1881,
    key: "Thyroid",
  },
  {
    allPrimarySites: ["Bladder"],
    caseCount: 1725,
    key: "Bladder",
  },
  {
    allPrimarySites: ["Liver and intrahepatic bile ducts"],
    caseCount: 1611,
    key: "Liver",
  },
  {
    allPrimarySites: ["Connective, subcutaneous and other soft tissues"],
    caseCount: 1574,
    key: "Soft Tissue",
  },
  {
    allPrimarySites: ["Brain"],
    caseCount: 1456,
    key: "Brain",
  },
  {
    allPrimarySites: ["Esophagus"],
    caseCount: 1403,
    key: "Esophagus",
  },
  {
    allPrimarySites: ["Small intestine", "Stomach"],
    caseCount: 1625,
    key: "Stomach",
  },
  {
    allPrimarySites: ["Cervix uteri"],
    caseCount: 915,
    key: "Cervix",
  },
  {
    allPrimarySites: ["Adrenal gland"],
    caseCount: 851,
    key: "Adrenal Gland",
  },
  {
    allPrimarySites: ["Heart, mediastinum, and pleura"],
    caseCount: 706,
    key: "Pleura",
  },
  {
    allPrimarySites: [
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
    caseCount: 1840,
    key: "Head and Neck",
  },
  {
    allPrimarySites: ["Testis"],
    caseCount: 542,
    key: "Testis",
  },
  {
    allPrimarySites: ["Lymph nodes"],
    caseCount: 538,
    key: "Lymph Nodes",
  },
  {
    allPrimarySites: [
      "Bones, joints and articular cartilage of limbs",
      "Bones, joints and articular cartilage of other and unspecified sites",
    ],
    caseCount: 724,
    key: "Bone",
  },

  {
    allPrimarySites: ["Thymus"],
    caseCount: 306,
    key: "Thymus",
  },
  {
    allPrimarySites: ["Other and unspecified parts of biliary tract"],
    caseCount: 227,
    key: "Bile Duct",
  },
  {
    allPrimarySites: ["Eye and adnexa"],
    caseCount: 222,
    key: "Eye",
  },
];
