# Project Summary - Validate Tables
Date Created        : 09/27/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Various Tables
Test-Case           : PEAR-2202

tags: gdc-data-portal-v2, regression, project-summary

## Navigate to Projects Page
* On GDC Data Portal V2 app
* Navigate to "Projects" from "Header" "section"

## Collect Information for Comparison
* Select or deselect these options from the table column selector
    |table_column_to_select               |
    |-------------------------------------|
    |Files                                |
* In table "Projects", search the table for "CPTAC-3"
* Wait for table "Projects" body text to appear
    |expected_text  |row  |column |
    |---------------|-----|-------|
    |CPTAC-3        |1    |2      |
* Collect button labels in table "Projects" for comparison
    |button_label               |row  |column |
    |---------------------------|-----|-------|
    |Primary Site Count CPTAC-3 |1    |4      |
    |Case Count CPTAC-3         |1    |6      |
    |File Count CPTAC-3         |1    |8      |

## Validate Item Counts on Summary Page
* Quick search for "CPTAC-3" and go to its page
* Is text "The project has controlled access data which requires dbGaP Access. See instructions for Obtaining Access to Controlled Data." present on the page
* Collect "File Count" on Project Summary page
* Collect "Case Count" on Project Summary page
* Collect "Annotation Count" on Project Summary page
* Collect table "Primary Sites Project Summary" Item Count for comparison
* Collect table "Annotations Project Summary" Item Count for comparison

* Verify "File Count CPTAC-3" and "File Count Project Summary" are "Equal"
* Verify "Case Count CPTAC-3" and "Case Count Project Summary" are "Equal"
* Verify "Primary Site Count CPTAC-3" and "Primary Sites Project Summary Item Count" are "Equal"
* Verify "Annotation Count Project Summary" and "Annotations Project Summary Item Count" are "Equal"

## Summary Table
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Project ID                             |
    |dbGaP Study Accession                  |
    |Project Name                           |
    |Program                                |
    |CPTAC-3                                |
    |phs001287                              |
    |CPTAC-Brain, Head and Neck, Kidney, Lung, Pancreas, Uterus|
* Verify the table "Summary Project Summary" is not displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Disease Type                           |
    |Primary Site                           |

## Data Category
* Verify the table "Data Category Project Summary" is displaying this information
    |text_to_validate           |
    |---------------------------|
    |Data Category              |
    |Copy Number Variation      |
    |DNA Methylation            |
    |Sequencing Reads           |
    |Simple Nucleotide Variation|
    |Somatic Structural Variation|
    |Structural Variation       |
    |Transcriptome Profiling    |

## Experimental Strategy
* Verify the table "Experimental Strategy Project Summary" is displaying this information
    |text_to_validate           |
    |---------------------------|
    |Methylation Array          |
    |miRNA-Seq                  |
    |RNA-Seq                    |
    |scRNA-Seq                  |
    |Targeted Sequencing        |
    |WGS                        |
    |WXS                        |

## Primary Sites
* In table "Primary Sites Project Summary", search the table for "Pancreas"
* Pause "2" seconds
* Select value from table "Primary Sites Project Summary" by row and column
    |row   |column|
    |------|------|
    |1     |2     |
* Verify the table "Primary Sites Project Summary" is displaying this information
    |text_to_validate           |
    |---------------------------|
    |Disease Type               |
    |Cases                      |
    |Experimental Strategy      |
    |Files                      |
    |Pancreas                   |
    |Methylation Array, miRNA-Seq, RNA-Seq, Targeted Sequencing, WGS, WXS|
    |ductal and lobular neoplasms|
    |not applicable             |
* Collect button labels in table "Primary Sites Project Summary" for comparison
    |button_label                                     |row  |column |
    |-------------------------------------------------|-----|-------|
    |CPTAC-3 Primary Site Pancreas Case Count         |1    |3      |
    |CPTAC-3 Primary Site Pancreas File Count         |1    |5      |
* Select value from table "Primary Sites Project Summary" by row and column
    |row   |column|
    |------|------|
    |1     |3     |
* Name the cohort "CPTAC-3 Primary Site Pancreas" in the Cohort Bar section
* Perform action and validate modal text
    |Action to Perform|Text to validate in modal                                          |Keep or Remove Modal|
    |-----------------|-------------------------------------------------------------------|--------------------|
    |Save             |CPTAC-3 Primary Site Pancreas has been saved                       |Remove Modal        |

## Annotations Table
* In table "Annotations Project Summary", search the table for "C3N-00852"
* Verify the table "Annotations Project Summary" is displaying this information
    |text_to_validate           |
    |---------------------------|
    |UUID                       |
    |Case ID                    |
    |Entity Type                |
    |Entity ID                  |
    |Category                   |
    |Classification             |
    |Created Datetime           |
* In table "Annotations Project Summary" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |Case ID                                |
    |Created Datetime                       |
    |Notes                                  |
* Verify the table "Annotations Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Case UUID                              |
    |Notes                                  |
    |00615882-6e5a-46b4-891a-c058a28b3b60   |
    |61d83f5b-b534-44b0-9d0b-668c4e0a08ef   |
    |C3N-00852                              |
    |aliquot                                |
    |2d056d3c-0b61-4ddc-905e-df2e38e968ba   |
    |General                                |
    |Notification                           |
    |Variants from SomaticSniper are not included.|
* Verify the table "Annotations Project Summary" is not displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Created Datetime                       |
    |2022-02-28T11:47:23.155838-06:00       |
* Download "TSV" from "Project Summary Annotations"
* Read from "TSV from Project Summary Annotations"
* Verify that "TSV from Project Summary Annotations" has expected information
    |required_info                          |
    |---------------------------------------|
    |Case UUID                              |
    |Case ID                                |
    |Entity Type                            |
    |Entity ID                              |
    |Category                               |
    |Classification                         |
    |Notes                                  |
    |00615882-6e5a-46b4-891a-c058a28b3b60   |
    |C3N-00852                              |
    |masked_somatic_mutation                |
    |CPT0024660012                          |
    |Variants from SomaticSniper are not included.|
* Verify that "TSV from Project Summary Annotations" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |Created Datetime                       |
    |Status                                 |
    |2022-02-28T11:47:23.155838-06:00       |
    |Approved                               |
    |007eafca-85e4-4924-ba08-543a12167217   |
    |e002d33a-86c4-4e19-acde-d542096f5fdb   |
    |C3L-03467                              |
* Download "JSON" from "Project Summary Annotations"
* Read from "JSON from Project Summary Annotations"
* Verify that "JSON from Project Summary Annotations" has expected information
    |required_info                          |
    |---------------------------------------|
    |00615882-6e5a-46b4-891a-c058a28b3b60   |
    |Variants from SomaticSniper are not included.|
    |2022-02-28T11:47:23.155838-06:00       |
    |61d83f5b-b534-44b0-9d0b-668c4e0a08ef   |
    |be7fbc36-f287-4f5c-ac49-b8dee330ddcd   |
    |a20a79b2-4125-4f51-a9fc-f0192d6f913b   |
    |CPT0024650009                          |
    |afd2cb94-a96e-485a-9b51-ea61aac851ee   |
    |61d83f5b-b534-44b0-9d0b-668c4e0a08ef   |
    |C3N-00852                              |
    |f1a3cd15-5978-4ae8-9c30-8d5ebc4c000b   |
* Verify that "JSON from Project Summary Annotations" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |007eafca-85e4-4924-ba08-543a12167217   |
    |727aded8-f047-485f-b9cc-edd54aa940af   |
    |e00a1454-0687-48a1-a6c9-caeef0bc4221   |
    |5a88652c-cc2f-44c8-9e61-e89d46222743   |
    |d91781d2-4493-4321-ab88-4ec4ac6a9afb   |
    |e6ac9549-7257-4733-ad48-048e991f8bcb   |

## Annotations Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |annotation_id	                        |
  |entity_submitter_id	                    |
  |notes	                                |
  |entity_type	                            |
  |case_id	                                |
  |project.project_id                       |
  |project.program.name                     |
  |classification	                        |
  |entity_id	                            |
  |category	                                |
  |created_datetime                         |
  |status                                   |
  |case_submitter_id	                    |
* Verify that the "JSON from Project Summary Annotations" has <field_name> for each object

## Validate Created Cohorts
* Navigate to "Downloads" from "Header" "section"
* Switch cohort to "CPTAC-3 Primary Site Pancreas" from the Cohort Bar dropdown list
* "CPTAC-3 Primary Site Pancreas" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Collect "Files" Count on the Repository page
* Verify "CPTAC-3 Primary Site Pancreas Case Count" and "Cohort Bar Case Count" are "Equal"
* Verify "CPTAC-3 Primary Site Pancreas File Count" and "Files Count Repository Page" are "Equal"

## Validate Combinations - Number of Diseases, Primary Sites, Annotations
* Quick search for "TCGA-LGG" and go to its page
* Is text "Cases and File Counts by Data Category" present on the page
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Disease Type                           |
    |Primary Site                           |
    |Gliomas                                |
    |Brain                                  |
* Verify these items are not on the page
    |item_to_validate                               |
    |-----------------------------------------------|
    |Table Primary Sites Project Summary            |
* Quick search for "MATCH-C1" and go to its page
* Is text "Cases and File Counts by Experimental Strategy" present on the page
* Verify these items are not on the page
    |item_to_validate                               |
    |-----------------------------------------------|
    |Table Annotations Project Summary              |
* Quick search for "CGCI-HTMCP-LC" and go to its page
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Disease Type                           |
    |Primary Site                           |
    |6 Disease Types                        |
    |Bronchus and lung                      |
