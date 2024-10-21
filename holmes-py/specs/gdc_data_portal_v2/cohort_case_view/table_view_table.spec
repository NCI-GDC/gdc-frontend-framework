# Cohort Case View - Table View Table
Date Created        : 10/04/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Cohort Table
Test-Case           : PEAR-1052

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Navigate to Table View
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Expand or collapse the cohort bar
* Go to tab "Table View" in Cohort Case View

## Validate Table Headers
* Verify the table "Cases" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Cart                                   |2      |
    |Slides                                 |3      |
    |Case ID                                |4      |
    |Project                                |5      |
    |Primary Site                           |6      |
    |Gender                                 |7      |
    |Files                                  |8      |
    |Annotations                            |9      |

* In table "Cases" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |Case UUID                              |
    |Program                                |
    |Disease Type                           |
    |Primary Diagnosis                      |
    |Age At Diagnosis                       |
    |Vital Status                           |
    |Days to Death                          |
    |Race                                   |
    |Ethnicity                              |
    |Experimental Strategy                  |

* Verify the table "Cases" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Cart                                   |2      |
    |Slides                                 |3      |
    |Case ID                                |4      |
    |Case UUID                              |5      |
    |Project                                |6      |
    |Program                                |7      |
    |Primary Site                           |8      |
    |Disease Type                           |9      |
    |Primary Diagnosis                      |10     |
    |Age At Diagnosis                       |11     |
    |Vital Status                           |12     |
    |Days To Death                          |13     |
    |Gender                                 |14     |
    |Race                                   |15     |
    |Ethnicity                              |16     |
    |Files                                  |17     |
    |Experimental Strategy                  |18     |
    |Annotations                            |19     |

## Validate Table Body Text
* In table "Cases", search the table for "6bcc0642-12f7-4e7b-93e3-383a7fc3d0c0"
* Wait for table "Cases" body text to appear
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |MMRF_1771                              |1    |4      |
* Verify the table "Cases" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |6bcc0642-12f7-4e7b-93e3-383a7fc3d0c0   |1    |5      |
    |MMRF-COMMPASS                          |1    |6      |
    |MMRF                                   |1    |7      |
    |Hematopoietic and reticuloendothelial systems|1|8    |
    |Plasma Cell Tumors                     |1    |9      |
    |Multiple myeloma                       |1    |10     |
    |58 years 171 days                      |1    |11     |
    |Dead                                   |1    |12     |
    |1 year 209 days                        |1    |13     |
    |male                                   |1    |14     |
    |asian                                  |1    |15     |
    |not hispanic or latino                 |1    |16     |
    |27                                     |1    |17     |
    |RNA-Seq, WGS, WXS                      |1    |18     |
    |0                                      |1    |19     |

## Validate Table Links
* Select value from table "Cases" by row and column
    |row   |column|
    |------|------|
    |1     |4     |
* Wait for table "Summary Case Summary" body text to appear
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |MMRF_1771                              |2    |2      |
    |Multiple Myeloma CoMMpass Study        |4    |2      |
* Close the modal

* Select value from table "Cases" by row and column
    |row   |column|
    |------|------|
    |1     |6     |
* Wait for table "Summary Project Summary" body text to appear
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |MMRF-COMMPASS                          |1    |2      |
    |phs000748                              |2    |2      |
* Close the modal

## Reset Columns
* In table "Cases" restore default column selector options
* Verify the table "Cases" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Cart                                   |2      |
    |Slides                                 |3      |
    |Case ID                                |4      |
    |Project                                |5      |
    |Primary Site                           |6      |
    |Gender                                 |7      |
    |Files                                  |8      |
    |Annotations                            |9      |

## Slides
* In table "Cases", search the table for "ff6b5fc8-0572-4b58-b3a5-bcda41badbc8"
* Wait for table "Cases" body text to appear
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |TCGA-PG-A914                           |1    |4      |
* Select value from table "Cases" by row and column
    |row   |column|
    |------|------|
    |1     |3     |
* Select case or slide "TCGA-PG-A914-01A-01-TS1" on the Image Viewer page
* Select "Details" on the Image Viewer page
* Verify the slide image viewer is showing "1 of 1" cases
* Verify details fields and values
  |field_name                       |value                                  |
  |---------------------------------|---------------------------------------|
  |File_id                          |e68d86ba-baf7-4c85-ae9a-e65fb490810b   |
  |Submitter_id                     |TCGA-PG-A914-01A-01-TS1                |
  |Slide_id                         |93ebb8f5-491e-4f5b-b8a9-03cb4d9423a3   |
  |Percent_tumor_nuclei	            |90                                     |
  |Percent_monocyte_infiltration    |--                                     |
  |Percent_normal_cells	            |--                                     |
  |Percent_stromal_cells	        |20                                     |
  |Percent_eosinophil_infiltration  |--                                     |
  |Percent_lymphocyte_infiltration  |--                                     |
  |Percent_neutrophil_infiltration  |--                                     |
  |Section_location	                |TOP                                    |
  |Percent_granulocyte_infiltration |--                                     |
  |Percent_necrosis	                |--                                     |
  |Percent_inflam_infiltration	    |--                                     |
  |Number_proliferating_cells	    |--                                     |
  |Percent_tumor_cells	            |80                                     |

## Navigate Back to Table View
* Navigate to "Analysis" from "Header" "section"
* Expand or collapse the cohort bar
* Go to tab "Table View" in Cohort Case View

## Cart Button
* In table "Cases", search the table for "68cf6fcd-e43e-4e39-9f8a-a37c95a5a01a"
* Wait for table "Cases" body text to appear
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |ER-ACGR                                |1    |4      |
* Select value from table "Cases" by row and column
    |row   |column|
    |------|------|
    |1     |2     |
* Select "Add Files To Cart" in Cohort Table View
* Is modal with text "files to the cart." present on the page and "Remove Modal"
* Select value from table "Cases" by row and column
    |row   |column|
    |------|------|
    |1     |2     |
* Select "Remove Files From Cart" in Cohort Table View
* Is modal with text "files from the cart." present on the page and "Remove Modal"
