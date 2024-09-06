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
## Summary Table
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
## Data Category Table
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

## Experimental Strategy Table
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
## Clinical Table - TSV Download: Exposure, Pathological Detail
* Download "TSV" from "Case Summary Clinical Table"
* Read file content from compressed "TSV from Case Summary Clinical Table"
* Verify that "TSV from Case Summary Clinical Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |5fd8d17e-57d2-4270-8728-de259ff6b2fe   |
    |cigarettes_per_day                     |
    |exposure_type                          |
    |Tobacco                                |
    |respirable_crystalline_silica_exposure |
    |tobacco_smoking_status                 |
    |Current Reformed Smoker for > 15 yrs   |
    |diagnosis_id                           |
    |26a5ccaa-d86d-4283-9a00-39ed229586f9   |
    |extracapsular_extension_present        |
    |margin_status                          |
    |pathology_detail_submitter_id          |
    |tumor_largest_dimension_diameter       |
    |3.5                                    |

## Clinical Table - Download JSON: Exposure, Pathological Detail
* Download "JSON" from "Case Summary Clinical Table"
* Read from "JSON from Case Summary Clinical Table"
* Verify that "JSON from Case Summary Clinical Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |Tobacco                                |
    |Current Reformed Smoker for > 15 yrs   |
    |1968                                   |
    |Stage I                                |
    |Renal cell carcinoma, NOS              |
    |30196a26-d73e-428c-9f7a-707e6a2c7241   |
    |C3N-03018-PATH                         |
    |Kidney, NOS                            |

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

## Clinical Table - TSV Download: Follow Up, Family History, Clinical
* Download "TSV" from "Case Summary Clinical Table"
* Read file content from compressed "TSV from Case Summary Clinical Table"
* Verify that "TSV from Case Summary Clinical Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |case_id                                |
    |cause_of_response                      |
    |barretts_esophagus_goblet_cells_present|
    |hysterectomy_margins_involved          |
    |recist_targeted_regions_number         |
    |Lactate Dehydrogenase                  |
    |molecular_analysis_method              |
    |bone_marrow_malignant_cells            |
    |non_nodal_tumor_deposits               |
    |rhabdoid_present                       |
    |zone_of_origin_prostate                |
    |relative_smoker                        |
    |relatives_with_cancer_history_count    |
    |relationship_gender                    |
    |3d5ebf3f-0cbd-458a-820d-65652e9682d7   |
    |MMRF_2081                              |
    |additional_pathology_findings          |
    |treatment_type                         |
    |MMRF-COMMPASS                          |

## Clinical Table - Download JSON: Follow Up, Family History, Clinical
* Download "JSON" from "Case Summary Clinical Table"
* Read from "JSON from Case Summary Clinical Table"
* Verify that "JSON from Case Summary Clinical Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |3d5ebf3f-0cbd-458a-820d-65652e9682d7   |
    |MMRF_2081                              |
    |MMRF_2081_family_history2              |
    |MMRF_2081_followup7                    |
    |MMRF-COMMPASS                          |
    |0ad0643b-8364-4ea3-a600-d03c0be2e6fd   |
    |not hispanic or latino                 |

## Clinical Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |case_id	                                |
  |submitter_id	                            |
  |family_histories.relative_with_cancer_history|
  |project.project_id                       |
* Verify that the "JSON from Case Summary Clinical Table" has <field_name> for each object


## Navigate to Case Summary Page: TCGA-GV-A3QI
* Quick search for "06f936e9-5a90-40d3-b91a-713f2b4e6e11" and go to its page
## Biospecimen Table - Expand/Collapse Button
* Select "Expand All"
* Verify the table "Biospecimen Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |samples                                |
    |TCGA-GV-A3QI-10A                       |
    |portions                               |
    |TCGA-GV-A3QI-10A-01                    |
    |analytes                               |
    |TCGA-GV-A3QI-10A-01                    |
    |aliquots                               |
    |TCGA-GV-A3QI-10A-01D-A21Y-01           |
    |TCGA-GV-A3QI-10A-01D-A21Z-08           |
    |slides                                 |
    |TCGA-GV-A3QI-01A-01-TSA                |
* Select "Collapse All"
* Pause "2" seconds
* Verify the table "Biospecimen Case Summary" is not displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |TCGA-GV-A3QI-10A-01                    |
    |analytes                               |
    |TCGA-GV-A3QI-10A-01                    |
    |aliquots                               |
    |TCGA-GV-A3QI-10A-01D-A21Y-01           |
    |TCGA-GV-A3QI-10A-01D-A21Z-08           |
    |slides                                 |
    |TCGA-GV-A3QI-01A-01-TSA                |
    |TCGA-GV-A3QI-01A-11D-A21Z-08           |
    |TCGA-GV-A3QI-01Z-00-DX1                |

## Biospecimen Table - Samples
* Enter "074df1cb-b6b7-4d3f-9c0a-fe523b1854e0" in the text box "Biospecimen Search Bar"
* Verify the table "Selection Information Biospecimen" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Sample ID                              |
    |Sample UUID                            |
    |Sample Type                            |
    |Sample Type ID                         |
    |Tissue Type                            |
    |Tumor Code                             |
    |Tumor Code ID                          |
    |Oct Embedded                           |
    |Shortest Dimension                     |
    |Intermediate Dimension                 |
    |Longest Dimension                      |
    |Is Ffpe                                |
    |Pathology Report UUID                  |
    |Tumor Descriptor                       |
    |Current Weight                         |
    |Initial Weight                         |
    |Composition                            |
    |Time Between Clamping And Freezing     |
    |Time Between Excision And Freezing     |
    |Days To Sample Procurement             |
    |Freezing Method                        |
    |Preservation Method                    |
    |Days To Collection                     |
    |Portions                               |
    |TCGA-GV-A3QI-10A                       |
    |074df1cb-b6b7-4d3f-9c0a-fe523b1854e0   |
    |Blood Derived Normal                   |
    |10                                     |
    |Normal                                 |
    |false                                  |
    |Not Applicable                         |
    |Not Reported                           |
    |105 days                               |

## Biospecimen Table - Portions
* Enter "1d4435fe-3a24-426d-9b49-d800551fc4a0" in the text box "Biospecimen Search Bar"
* Verify the table "Selection Information Biospecimen" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Portion ID                             |
    |Portion UUID                           |
    |Portion Number                         |
    |Weight                                 |
    |Is Ffpe	                            |
    |Analytes                               |
    |Slides                                 |
    |TCGA-GV-A3QI-01A-11                    |
    |1d4435fe-3a24-426d-9b49-d800551fc4a0   |
    |false                                  |
    |--                                     |

## Biospecimen Table - Slides
* Enter "88217dc9-06a0-4839-8269-85ce0798ef89" in the text box "Biospecimen Search Bar"
* Verify the table "Selection Information Biospecimen" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Slide ID                               |
    |Slide UUID                             |
    |Percent Tumor Nuclei                   |
    |Percent Monocyte Infiltration          |
    |Percent Normal Cells                   |
    |Percent Stromal Cells                  |
    |Percent Eosinophil Infiltration        |
    |Percent Lymphocyte Infiltration        |
    |Percent Neutrophil Infiltration        |
    |Section Location                       |
    |Percent Granulocyte Infiltration       |
    |Percent Necrosis                       |
    |Percent Inflam Infiltration            |
    |Number Proliferating Cells             |
    |Percent Tumor Cells                    |
    |Slide Image                            |
    |TCGA-GV-A3QI-01A-01-TSA                |
    |88217dc9-06a0-4839-8269-85ce0798ef89   |
    |TOP                                    |
    |100                                    |
* Select button "Add Remove Cart Biospecimen"
* Is modal with text "Added TCGA-GV-A3QI-01A-01-TSA.88217DC9-06A0-4839-8269-85CE0798EF89.svs to the cart." present on the page and "Remove Modal"
* Select button "Add Remove Cart Biospecimen"
* Is modal with text "Removed TCGA-GV-A3QI-01A-01-TSA.88217DC9-06A0-4839-8269-85CE0798EF89.svs from the cart." present on the page and "Remove Modal"
* Select button "View Slide Image Biospecimen"
* Select "Details" on the Image Viewer page
* Verify details fields and values
  |field_name                       |value                                  |
  |---------------------------------|---------------------------------------|
  |File_id                          |1fa7d4b5-147a-47a5-8605-3baa0d7be899   |
  |Submitter_id                     |TCGA-GV-A3QI-01A-01-TSA                |
  |Slide_id                         |88217dc9-06a0-4839-8269-85ce0798ef89   |

## Navigate back to Case Summary Page: TCGA-GV-A3QI
* Quick search for "06f936e9-5a90-40d3-b91a-713f2b4e6e11" and go to its page
## Biospecimen Table - Analyte
* Enter "873bc630-7061-4dee-9973-4a4f1b979eaf" in the text box "Biospecimen Search Bar"
* Verify the table "Selection Information Biospecimen" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Analyte ID                             |
    |Analyte UUID                           |
    |Analyte Type                           |
    |Analyte Type ID                        |
    |Well Number                            |
    |Amount                                 |
    |A260 A280 Ratio                        |
    |Concentration                          |
    |Spectrophotometer Method               |
    |Aliquots                               |
    |TCGA-GV-A3QI-01A-11W                   |
    |873bc630-7061-4dee-9973-4a4f1b979eaf   |
    |Repli-G (Qiagen) DNA                   |

## Biospecimen Table - Aliquot
* Enter "59c24b21-b1e8-4752-bd0a-b48dd802643b" in the text box "Biospecimen Search Bar"
* Verify the table "Selection Information Biospecimen" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Aliquot ID                             |
    |Aliquot UUID                           |
    |Source Center                          |
    |Amount                                 |
    |Concentration                          |
    |Analyte Type                           |
    |Analyte Type ID                        |
    |TCGA-GV-A3QI-10A-01D-A21Z-08           |
    |59c24b21-b1e8-4752-bd0a-b48dd802643b   |
    |23                                     |
    |0.07                                   |

## Biospecimen Table - TSV Download
* Download "TSV" from "Case Summary Biospecimen Table"
* Read file content from compressed "TSV from Case Summary Biospecimen Table"
* Verify that "TSV from Case Summary Biospecimen Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |project_id                             |
    |sample_id                              |
    |portion_id                             |
    |analyte_submitter_id                   |
    |aliquot_id                             |
    |TCGA-GV-A3QI-10A-01W-A226-08           |
    |06f936e9-5a90-40d3-b91a-713f2b4e6e11   |
    |45f1a50a-8d05-48c5-8f82-ba4955117d1b   |
    |TCGA-GV-A3QI-01A-11                    |
    |ffc59e86-1afb-4cdb-8651-191b21ee7876   |
    |TCGA-GV-A3QI-01A-11D-A21Z-08           |
    |experimental_protocol_type             |
    |spectrophotometer_method               |
    |mirVana (Allprep DNA) RNA              |
    |analyte_type_id                        |
    |slide_id                               |
    |88217dc9-06a0-4839-8269-85ce0798ef89   |
    |percent_inflam_infiltration            |
    |percent_tumor_nuclei                   |
    |portion_submitter_id                   |
    |creation_datetime                      |

## Biospecimen Table - Download JSON
* Download "JSON" from "Case Summary Biospecimen Table"
* Read from "JSON from Case Summary Biospecimen Table"
* Verify that "JSON from Case Summary Biospecimen Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |06f936e9-5a90-40d3-b91a-713f2b4e6e11   |
    |TCGA-BLCA                              |
    |TCGA-GV-A3QI                           |
    |074df1cb-b6b7-4d3f-9c0a-fe523b1854e0   |
    |Blood Derived Normal                   |
    |9d5d3fb7-22e5-4ad5-9036-3074e8ac41a8   |
    |3792A65B-C233-4DDF-88F8-8829B73616FE   |
    |873bc630-7061-4dee-9973-4a4f1b979eaf   |
    |32a26490-4b9f-494c-b298-1bd7367aa070   |
    |88217dc9-06a0-4839-8269-85ce0798ef89   |
    |7375d70d-f43f-5589-931e-59e50d743f33   |

## Biospecimen Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |case_id	                                |
  |project.project_id                       |
  |submitter_id	                            |
  |samples.sample_type_id	                |
  |samples.portions.portion_id              |
  |samples.portions.analytes.analyte_id     |
  |samples.pathology_report_uuid	        |
  |samples.portions.slides.slide_id         |
  |samples.portions.analytes.aliquots.aliquot_quantity|
* Verify that the "JSON from Case Summary Biospecimen Table" has <field_name> for each object

## Files Table - Count
* Collect "File" Count from Case Summary Header for comparison
* Collect table "Files Case Summary" Item Count for comparison
* Verify "File Count from Case Summary Header" and "Files Case Summary Item Count" are "Equal"

## Files Table - TSV Download
* Search "tcga-blca" in the files table on the case summary page
* Download "TSV" from "Case Summary Files Table"
* Read from "TSV from Case Summary Files Table"
* Verify that "TSV from Case Summary Files Table" has expected information
  |required_info                            |
  |-----------------------------------------|
  |Access                                   |
  |File Name                                |
  |Data Category                            |
  |Data Format                              |
  |Experimental Strategy                    |
  |File Size                                |
  |TCGA-BLCA.6f417a24-f868-4cd1-a60b-37df5f098c76.gene_level_copy_number.v36.tsv|
  |Copy Number Variation                    |
  |BEDPE                                    |
  |RNA-Seq                                  |
  |39925                                    |
  |Controlled                               |
* Verify that "TSV from Case Summary Files Table" does not contain specified information
  |required_info                                                            |
  |-------------------------------------------------------------------------|
  |nationwidechildrens.org_ssf_normal_controls_blca.txt                     |
  |TCGA-GV-A3QI-01A-01-TSA.88217DC9-06A0-4839-8269-85CE0798EF89.svs         |
  |fadf6ebc-28d7-44a5-af0d-518f36cad472.mirbase21.mirnas.quantification.txt |

## Files Table - Download JSON
* Download "JSON" from "Case Summary Files Table"
* Read from "JSON from Case Summary Files Table"
* Verify that "JSON from Case Summary Files Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |00980fb9-5519-4245-bd47-f1858dd69aaf   |
    |Structural Variation                   |
    |06f936e9-5a90-40d3-b91a-713f2b4e6e11   |
    |Genotyping Array                       |
    |Affymetrix SNP 6.0                     |
    |Allele-specific Copy Number Segment    |
    |a1098528-bd94-4d24-bd18-b811fdddd951   |
    |TCGA-BLCA                              |
* Verify that "JSON from Case Summary Files Table" does not contain specified information
  |required_info                                                            |
  |-------------------------------------------------------------------------|
  |nationwidechildrens.org_ssf_normal_controls_blca.txt                     |
  |TCGA-GV-A3QI-01A-01-TSA.88217DC9-06A0-4839-8269-85CE0798EF89.svs         |
  |fadf6ebc-28d7-44a5-af0d-518f36cad472.mirbase21.mirnas.quantification.txt |

## Files Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |data_format                              |
  |cases.case_id                            |
  |cases.project.project_id                 |
  |access	                                |
  |file_name                                |
  |file_id                                  |
  |data_type                                |
  |data_category                            |
  |experimental_strategy                    |
  |platform                                 |
  |file_size                                |
* Verify that the "JSON from Case Summary Files Table" has <field_name> for each object
