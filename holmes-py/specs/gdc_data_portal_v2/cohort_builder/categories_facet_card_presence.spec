# Cohort Builder - Verifying presence and filter type of all facet cards
Date Created    : 02/16/2023
Version			    : 2.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - category/facet card presence, and facet card filter type
Test-case       : PEAR-796, PEAR-2673

tags: gdc-data-portal-v2, cohort-builder, facet-cards, regression

## Navigate to Cohort Builder

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - Validate presence of all categories and facet cards

* Validate presence of facet cards and their filter types on the "General" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Program                    |enum                                           |
  |Project                    |enum                                           |
  |Primary Site               |enum                                           |
  |Tissue or Organ of Origin  |enum                                           |
  |Disease Type               |enum                                           |
  |Primary Diagnosis          |enum                                           |
  |Case ID                    |upload                                         |

* Validate presence of facet cards and their filter types on the "Demographic" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Sex at Birth               |enum                                           |
  |Race                       |enum                                           |
  |Ethnicity                  |enum                                           |
  |Age at Diagnosis           |range input with prefixed ranges days and years|
  |Vital Status               |enum                                           |

* Validate presence of facet cards and their filter types on the "General Diagnosis" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Ajcc Clinical Stage        |enum                                           |
  |Ajcc Pathologic Stage      |enum                                           |
  |Uicc Clinical Stage        |enum                                           |
  |Uicc Pathologic Stage      |enum                                           |
  |Tumor Grade                |enum                                           |
  |Morphology                 |enum                                           |
  |Year of Diagnosis          |range input with prefixed ranges               |
  |Site of Resection or Biopsy|enum                                           |
  |Sites of Involvement       |enum                                           |
  |Laterality                 |enum                                           |

* Validate presence of facet cards and their filter types on the "Disease Status and History" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Prior Malignancy           |enum                                           |
  |Prior Treatment            |enum                                           |
  |Synchronous Malignancy     |enum                                           |
  |Progression or Recurrence  |enum                                           |
  |Residual Disease           |enum                                           |
  |Child Pugh Classification  |enum                                           |
  |Ishak Fibrosis Score       |enum                                           |

* Validate presence of facet cards and their filter types on the "Disease Specific Classifications" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Ann Arbor Clinical Stage   |enum                                           |
  |Ann Arbor Pathologic Stage |enum                                           |
  |Cog Renal Stage            |enum                                           |
  |Figo Stage                 |enum                                           |
  |Igcccg Stage               |enum                                           |
  |Inrg Stage                 |enum                                           |
  |Inss Stage                 |enum                                           |
  |Iss Stage                  |enum                                           |
  |Masaoka Stage              |enum                                           |
  |Inpc Grade                 |enum                                           |
  |Who Cns Grade              |enum                                           |
  |Cog Neuroblastoma Risk Group   |enum                                       |
  |Cog Rhabdomyosarcoma Risk Group|enum                                       |
  |International Prognostic Index |enum                                       |
  |Eln Risk Classification        |enum                                       |
  |Medulloblastoma Molecular Classification|enum                              |
  |Wilms Tumor Histologic Subtype |enum                                       |
  |Weiss Assessment Score     |enum                                           |

* Validate presence of facet cards and their filter types on the "Treatment" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Best Overall Response      |enum                                           |
  |Therapeutic Agents         |enum                                           |
  |Treatment Intent Type      |enum                                           |
  |Treatment Outcome          |enum                                           |
  |Treatment Type             |enum                                           |

* Validate presence of facet cards and their filter types on the "Exposure" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Alcohol History            |enum                                           |
  |Alcohol Intensity          |enum                                           |
  |Tobacco Smoking Status     |enum                                           |
  |Cigarettes Per Day         |range input                                    |
  |Pack Years Smoked          |range input                                    |
  |Tobacco Smoking Onset Year |range input with prefixed ranges               |

* Validate presence of facet cards and their filter types on the "Other Clinical Attributes" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Bmi                        |range input                                    |
  |Weight                     |range input                                    |
  |Height                     |range input                                    |
  |Risk Factors               |enum                                           |
  |Menopause Status           |enum                                           |
  |Comorbidities              |enum                                           |
  |Pregnancy Outcome          |enum                                           |
  |Number of Pregnancies      |enum                                           |

* Validate presence of facet cards and their filter types on the "Biospecimen" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Tissue Type                |enum                                           |
  |Biospecimen Anatomic Site  |enum                                           |
  |Specimen Type              |enum                                           |
  |Preservation Method        |enum                                           |
  |Tumor Descriptor           |enum                                           |
  |Analyte Type               |enum                                           |

* Validate presence of facet cards and their filter types on the "Genomic Filters" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Mutated Gene               |upload                                         |
  |Somatic Mutation           |upload                                         |

* Validate presence of facet cards and their filter types on the "Available Data" tab on the Cohort Builder page
  |facet_name                 |expected_filter_type                           |
  |---------------------------|-----------------------------------------------|
  |Data Category              |enum                                           |
  |Data Type                  |enum                                           |
  |Experimental Strategy      |enum                                           |
  |Workflow Type              |enum                                           |
  |Data Format                |enum                                           |
  |Platform                   |enum                                           |
  |Access                     |enum                                           |
