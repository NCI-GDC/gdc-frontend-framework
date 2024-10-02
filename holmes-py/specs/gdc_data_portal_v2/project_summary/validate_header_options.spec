# Project Summary - Validate Header Options
Date Created        : 09/27/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate All Buttons in Project Summary Header
Test-Case           : PEAR-2202

tags: gdc-data-portal-v2, regression, project-summary

## Navigate to Projects Page
* On GDC Data Portal V2 app
* Navigate to "Projects" from "Header" "section"

## Save Cohort Button
* Quick search for "CTSP-DLBCL1" and go to its page
* Is text "The project has controlled access data which requires dbGaP Access. See instructions for Obtaining Access to Controlled Data." present on the page
* Collect "File Count" on Project Summary page
* Collect "Case Count" on Project Summary page
* Select "Save New Cohort" on Project Summary page
* Name the cohort "CTSP-DLBCL1 PSP" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |CTSP-DLBCL1 PSP has been saved             |Remove Modal        |
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "CTSP-DLBCL1 PSP" from the Cohort Bar dropdown list
* Navigate to "Downloads" from "Header" "section"
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Case Count Project Summary" are "Equal"
* Collect "Files" Count on the Repository page
* Collect "Cases" Count on the Repository page
* Verify "Files Count Repository Page" and "File Count Project Summary" are "Equal"
* Verify "Cases Count Repository Page" and "Case Count Project Summary" are "Equal"

## Biospecimen Download - TSV
* Quick search for "TCGA-READ" and go to its page
* Download "TSV" from "Project Summary Biospecimen"
* Read file content from compressed "TSV from Project Summary Biospecimen"
* Verify that "TSV from Project Summary Biospecimen" has expected information
    |required_info                          |
    |---------------------------------------|
    |project_id                             |
    |analyte_submitter_id                   |
    |concentration                          |
    |selected_normal_wxs                    |
    |3f2ca278-c74a-4aa7-b029-189d9d0b510c   |
    |050ea84e-f0ab-453f-b2af-d0dbfca313ba   |
    |a41a13f9-bc5d-49de-99a2-8365bf1840dc   |
    |released                               |
    |portion_submitter_id                   |
    |analyte_quantity                       |
    |experimental_protocol_type             |
    |spectrophotometer_method               |
    |Repli-G (Qiagen) DNA                   |
    |Allprep RNA Extraction                 |
    |UV Spec                                |
    |slide_submitter_id                     |
    |percent_neutrophil_infiltration        |
    |section_location                       |
    |c8b01ca9-20f7-4858-80ed-372526539069   |
    |BOTTOM                                 |
    |creation_datetime                      |
    |portion_number                         |
    |0011a67b-1ba9-4a32-a6b8-7850759a38cf   |
    |Not Reported                           |
    |tumor_descriptor                       |
* Verify that "TSV from Project Summary Biospecimen" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET-AML                             |

## Biospecimen Download - JSON
* Download "JSON" from "Project Summary Biospecimen"
* Read from "JSON from Project Summary Biospecimen"
* Verify that "JSON from Project Summary Biospecimen" has expected information
    |required_info                          |
    |---------------------------------------|
    |0011a67b-1ba9-4a32-a6b8-7850759a38cf   |
    |03877fe0-b0d6-4800-be46-b45c70350e48   |
    |2023-11-08T11:21:04.275414-06:00       |
    |1ecc83f3-3ee1-4882-a0c1-a63876937096   |
    |19085411-c097-42d1-baf8-1ffe7da01b90   |
    |4598d80-df38-47dd-a74a-457c3b27d148    |
    |b4e1dde1-d2b8-4dd2-b0c0-5bb927825869   |
    |a35fab26-d715-5e48-9563-6cd6b189b989   |
    |9e4a7f71-dd47-52dc-b5e2-d2e84fcf7e8f   |
    |TCGA-AG-3727                           |
    |TCGA-READ                              |
    |586cc18c-4f3d-4a54-aa2b-4a641e48b952   |
    |4c18f980-7f2c-4d2f-8ff9-1177f1b5169e   |
* Verify that "JSON from Project Summary Biospecimen" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET-AML                             |

## Biospecimen Download - Validate JSON File Fields
    |field_name                             |
    |---------------------------------------|
    |case_id                                |
    |project.project_id                     |
    |submitter_id	                        |
    |samples.sample_type                    |
    |samples.portions.portion_id            |
    |samples.portions.analytes.analyte_id	|
    |samples.portions.analytes.aliquots.aliquot_id|
    |samples.portions.analytes.aliquots.center.center_id|
    |samples.portions.annotations.annotation_id|
* Verify that the "JSON from Project Summary Biospecimen" has <field_name> for each object


## Clinical Download - TSV
* Quick search for "APOLLO-LUAD" and go to its page
* Download "TSV" from "Project Summary Clinical"
* Read file content from compressed "TSV from Project Summary Clinical"
* Verify that "TSV from Project Summary Clinical" has expected information
    |required_info                          |
    |---------------------------------------|
    |27a90230-ad95-43f9-8cc2-ed56d1b05136   |
    |APOLLO-LUAD                            |
    |barretts_esophagus_goblet_cells_present|
    |follow_up_id                           |
    |0eb870af-e683-48ea-a3fb-b6bfcd99356d   |
    |progression_or_recurrence_anatomic_site|
    |undescended_testis_corrected_laterality|
    |blood_test_normal_range_upper          |
    |test_result                            |
    |diagnosis_submitter_id                 |
    |lymphatic_invasion_present             |
    |tumor_depth_descriptor                 |
    |age_at_last_exposure                   |
    |occupation_type                        |
    |tobacco_smoking_status                 |
    |120.0                                  |
    |Current Reformed Smoker, Duration Not Specified|
    |AP-UG7J                                |
    |relationship_gender                    |
    |relative_with_cancer_history           |
    |relative_deceased                      |
    |ajcc_pathologic_m                      |
    |double_hit_lymphoma                    |
    |sites_of_involvement_count             |
    |largest_extrapelvic_peritoneal_focus   |
    |therapeutic_levels_achieved            |
    |Radiation Therapy, NOS                 |
    |Invasive mucinous adenocarcinoma       |
    |8230/3                                 |
    |Neoadjuvant                            |
* Verify that "TSV from Project Summary Clinical" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET                                 |
    |TCGA-READ                              |


## Clinical Download - JSON
* Download "JSON" from "Project Summary Clinical"
* Read from "JSON from Project Summary Clinical"
* Verify that "JSON from Project Summary Clinical" has expected information
    |required_info                          |
    |---------------------------------------|
    |Current Smoker                         |
    |5c412020-410a-45e3-a47e-7ea4dea55a74   |
    |2022-10-13T17:12:56.566239-05:00       |
    |AP-HFEA                                |
    |AP-HFEA-Diagnosis                      |
    |Solid carcinoma, NOS                   |
    |e17acf74-924d-4073-b8bb-c010a2e25054   |
    |89bad0c8-ed2e-482d-9dfa-48c2ad53e048   |
    |Current Reformed Smoker, Duration Not Specified|
    |AP-WPAM-Exposure                       |
    |T1b	                                |
    |7e302570-3d8e-4c13-8a85-a75b4bfe6a50   |
    |tissue_or_organ_of_origin	            |
    |e0b0ff1b-ba34-4663-bb92-f29e1546c885   |
    |6907e8ea-19b1-4011-9593-e67f5569fd85   |
* Verify that "JSON from Project Summary Clinical" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET                                 |
    |TCGA-READ                              |

## Clinical Download - Validate JSON File Fields
    |field_name                             |
    |---------------------------------------|
    |exposures.tobacco_smoking_status	    |
    |case_id	                            |
    |project.project_id                     |
    |submitter_id	                        |
    |diagnoses.site_of_resection_or_biopsy	|
    |demographic.demographic_id	            |
* Verify that the "JSON from Project Summary Clinical" has <field_name> for each object


## Manifest Download
* Download "Manifest" from "Project Summary"
* Read from "Manifest from Project Summary"
* Verify that "Manifest from Project Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |id                                     |
    |filename                               |
    |md5                                    |
    |size                                   |
    |state                                  |
    |b9842407-53ad-45d5-89af-e094402eaad9   |
    |038167c2-c7d9-47a2-9172-1cfe391c8131.rna_seq.genomic.gdc_realn.bam|
    |be407ecdc4ec3b9a8c20db87e5e52da1       |
    |7123471212                             |
    |released                               |
    |48fc1428-2504-4dc4-87eb-7f6229e9afb8   |
    |APOLLO-LUAD.08a6b063-8c56-4b2f-9845-aaf3df34b8a9.star_fusion.rna_fusion.tsv|
    |2a3b77df-87c9-415e-aec4-60efb5d2fc47   |
    |c2b36e17-c9f0-4ed9-9ada-51f8d3010717   |
    |128de9ce-2852-4583-bf86-f1e69d03f603
