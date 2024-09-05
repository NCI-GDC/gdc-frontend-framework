# Case Summary - Validate Tables
Date Created        : 09/05/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate All Tables and Sections in Case Summary Page
Test-Case           : PEAR-2139, PEAR-464

tags: gdc-data-portal-v2, case-summary

## Navigate to Case Summary Page: TCGA-13-0920
* On GDC Data Portal V2 app
* Quick search for "85a85a11-7200-4e96-97af-6ba26d680d59" and go to its page
## Data Information Table
* Verify the table "Summary Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Case UUID                              |
    |Case ID                                |
    |Project Name                           |
    |Disease Type                           |
    |Program                                |
    |Primary Site                           |
    |Images                                 |
    |85a85a11-7200-4e96-97af-6ba26d680d59   |
    |TCGA-OV                                |
    |Cystic, Mucinous and Serous Neoplasms  |
    |Ovary                                  |
* Select "Add Remove Files" on Case Summary page
* Is modal with text "Added 2 files to the cart." present on the page and "Remove Modal"
* Select "Add Remove Files" on Case Summary page
* Is modal with text "Removed 2 files from the cart." present on the page and "Remove Modal"
* Select button "View Slide Images"
* Select "Details" on the Image Viewer page
* Verify details fields and values
  |field_name                       |value                                  |
  |---------------------------------|---------------------------------------|
  |File_id                          |010fc715-0098-4967-a36f-a8922c03e40e   |
  |Submitter_id                     |TCGA-13-0920-01A-01-BS1                |
  |Slide_id                         |b7b9daea-d790-433c-93b2-db5e26827f30   |

## Navigate Back To Case Summary Page: TCGA-13-0920
* Quick search for "85a85a11-7200-4e96-97af-6ba26d680d59" and go to its page
## File Counts by Data Category Table
* Verify the table "Data Category Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Data Category                          |
    |Biospecimen                            |
    |Clinical                               |
    |Copy Number Variation                  |
    |DNA Methylation                        |
    |Proteome Profiling                     |
    |Sequencing Reads                       |
    |Simple Nucleotide Variation            |
    |Structural Variation                   |
    |Transcriptome Profiling                |

## File Counts by Experimental Strategy Table
* Verify the table "Experimental Strategy Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Experimental Strategy                  |
    |Expression Array                       |
    |Genotyping Array                       |
    |Methylation Array                      |
    |miRNA-Seq                              |
    |Reverse Phase Protein Array            |
    |Tissue Slide                           |
    |WGS                                    |
    |WXS                                    |

## Navigate Back To Case Summary Page: TARGET-20-PASGWS
* Quick search for "a51ed206-81e4-42d8-a50d-d19cd66f5dca" and go to its page
## Clinical Table - No Data
* Select tab "Diagnoses Treatments" on Case Summary page
* Is text "No Diagnoses Found." present on the page

* Select tab "Family Histories" on Case Summary page
* Is text "No Family Histories Found." present on the page

* Select tab "Exposures" on Case Summary page
* Is text "No Exposures Found." present on the page

* Select tab "Followups Molecular Tests" on Case Summary page
* Is text "No Follow Ups Found." present on the page

* Select tab "Demographic" on Case Summary page
* Is text "No Demographic Found." present on the page

## Navigate to Case Summary Page: C3N-03018
* Quick search for "5fd8d17e-57d2-4270-8728-de259ff6b2fe" and go to its page
## Clinical Table - No Molecular Tests, No Treatments
* Select tab "Followups Molecular Tests" on Case Summary page
* Is text "Total of 0 Molecular Tests" present on the page
* Is text "No Molecular Tests Found." present on the page

* Select tab "Diagnoses Treatments" on Case Summary page
* Is text "Total of 0 Treatments" present on the page
* Is text "No Treatments Found." present on the page

## Clinical Table - Exposure Tab
* Select tab "Exposures" on Case Summary page
* Verify the table "Clinical Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Exposure ID                            |
    |Exposure UUID                          |
    |Alcohol History                        |
    |Alcohol Intensity                      |
    |Tobacco Smoking Status                 |
    |Pack Years Smoked                      |
    |C3N-03018-EXP                          |
    |f1416551-58ec-43bb-a1f0-78658dae0794   |
    |Yes                                    |
    |Occasional Drinker                     |
    |Current Reformed Smoker for > 15 yrs   |

## Navigate to Case Summary Page: MMRF_2081
* Quick search for "3d5ebf3f-0cbd-458a-820d-65652e9682d7" and go to its page
## Clinical Table - Demographic
* Select tab "Demographic" on Case Summary page
* Verify the table "Clinical Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Demographic ID                         |
    |Demographic UUID                       |
    |Ethnicity                              |
    |Gender                                 |
    |Race                                   |
    |Days To Birth                          |
    |Days To Death                          |
    |Vital Status                           |
    |MMRF_2081_demographic1                 |
    |857aa4ee-8758-4297-9f67-539ff420c1cd   |
    |not hispanic or latino                 |
    |female                                 |
    |white                                  |
    |-69 years 151 days                     |
    |--                                     |
    |Alive                                  |

## Clinical Table - Diagnoses and Treatments
* Select tab "Diagnoses Treatments" on Case Summary page
* Verify the table "Clinical Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Diagnosis ID                           |
    |Diagnosis UUID                         |
    |Classification Of Tumor                |
    |Age At Diagnosis                       |
    |Days To Last Follow Up                 |
    |Days To Last Known Disease Status      |
    |Days To Recurrence                     |
    |Morphology                             |
    |Primary Diagnosis                      |
    |Prior Malignancy                       |
    |Synchronous Malignancy                 |
    |Progression Or Recurrence              |
    |Site Of Resection Or Biopsy            |
    |Tissue Or Organ Of Origin              |
    |Tumor Grade                            |
    |MMRF_2081_diagnosis1                   |
    |0ad0643b-8364-4ea3-a600-d03c0be2e6fd   |
    |69 years 151 days                      |
    |Unknown tumor status                   |
    |9732/3                                 |
    |Multiple myeloma                       |
    |Therapeutic Agents                     |
    |Treatment Intent Type                  |
    |Treatment or Therapy                   |
    |Days to Treatment Start                |
    |MMRF_2081_treatment2                   |
    |8af43e39-64d4-47df-b555-53c899377182   |
    |Dexamethasone                          |
    |180 days                               |

## Clinical Table - Family Histories
* Select tab "Family Histories" on Case Summary page
* Verify the table "Clinical Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Family History ID                      |
    |Family History UUID                    |
    |Relationship Age At Diagnosis          |
    |Relationship Gender                    |
    |Relationship Primary Diagnosis         |
    |Relationship Type                      |
    |Relative With Cancer History           |
    |MMRF_2081_family_history2              |
    |09d90ab1-aeb5-4bd8-9f1a-e2aa499251f0   |
    |male                                   |
    |Unknown                                |
    |Father                                 |

## Clinical Table - Followups Molecular Tests
* Select tab "Followups Molecular Tests" on Case Summary page
* Verify the table "Clinical Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Follow Up ID                           |
    |Follow Up UUID                         |
    |Days To Follow Up                      |
    |Comorbidity                            |
    |Risk Factor                            |
    |Progression Or Recurrence Type         |
    |Disease Response                       |
    |BMI                                    |
    |Height                                 |
    |Weight                                 |
    |ECOG Performance Status                |
    |Karnofsky Performance Status           |
    |Progression Or Recurrence Anatomic Site|
    |Reflux Treatment Type                  |
    |MMRF_2081_followup1                    |
    |b2bcc701-7758-44fa-a118-6730b14dd542   |
    |-4 days                                |
    |150                                    |
    |8                                      |
    |0                                      |
    |Gene Symbol                            |
    |Second Gene Symbol                     |
    |Molecular Analysis Method              |
    |Laboratory Test                        |
    |Test Value                             |
    |Test Result                            |
    |Test Units                             |
    |Biospecimen Type                       |
    |Variant Type                           |
    |Chromosome                             |
    |AA Change                              |
    |Antigen                                |
    |Mismatch Repair Mutation               |
    |MMRF_2081_molecular_test17             |
    |a432493e-dd05-41db-bf9b-5c0ac46c4429   |
    |Absolute Neutrophil                    |
    |2.8                                    |
    |ukat/L                                 |

## Clinical Table - TSV Download
* Download "TSV" from "Case Summary Clinical Table"
* Read file content from compressed "TSV from Case Summary Clinical Table"
* Verify that "TSV from Case Summary Clinical Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |case_id           |
    |cause_of_response           |
    |3d5ebf3f-0cbd-458a-820d-65652e9682d7           |
    |MMRF_2081           |
    |additional_pathology_findings           |

## Clinical Table - Download JSON
* Download "JSON" from "Case Summary Clinical Table"
* Read from "JSON from Case Summary Clinical Table"
* Verify that "JSON from Case Summary Clinical Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |3d5ebf3f-0cbd-458a-820d-65652e9682d7           |
    |MMRF_2081           |
    |MMRF_2081_family_history2           |
    |"MMRF_2081_followup7"           |
    |MMRF-COMMPASS           |
    |0ad0643b-8364-4ea3-a600-d03c0be2e6fd           |
    |not hispanic or latino           |

## Annotations Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |case_id	                                |
  |submitter_id	                            |
  |family_histories.relative_with_cancer_history|
  |project.project_id                       |

* Verify that the "JSON from Case Summary Clinical Table" has <field_name> for each object
