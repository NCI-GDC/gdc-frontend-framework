# Cohort Bar - Import Cohort
Date Created    : 03/13/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Bar - impoting a cohort
Test-case       : PEAR-499

tags: gdc-data-portal-v2, regression, cohort-bar

## Collect Data Portal Statistics
* On GDC Data Portal V2 app
* Navigate to "Home" from "Header" "section"
* Collect these data portal statistics for comparison
  |category       |name_to_store_statistic  |
  |---------------|-------------------------|
  |Cases          |Home Page Cases Count    |

## Import Cohort from Data Portal V2 file and Set as Current Cohort
* Navigate to "Cohort" from "Header" "section"
* Select "Upload" from the Cohort Bar
* Upload "organoid" "tsv" from "Cohort Bar" in "Cohort Bar Import" through "Browse"
* Select "Submit"
* Name the cohort "organoid" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                 |Keep or Remove Modal|
  |-----------------|----------------------------------------------------------|--------------------|
  |Save             |organoid has been saved. This is now your current cohort. |Remove Modal        |
* The cohort bar case count should be "70"
* Clear active cohort filters
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Equal"

## Import Cohort from Data Portal V1 file
* Select "Upload" from the Cohort Bar
* Upload "data portal v1 tcga chol" "tsv" from "Cohort Bar" in "Cohort Bar Import" through "Browse"
* Select "Submit"
* Name the cohort "data portal v1" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                        |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------------------|--------------------|
  |Save             |data portal v1 has been saved. This is now your current cohort.  |Remove Modal        |

## Import Cohort with all Case Identifiers
* Select "Upload" from the Cohort Bar
* Upload "Cases List" "txt" from "Cohort Bar" in "Cohort Bar Import" through "Browse"
* Select "Submit"
* Name the cohort "cases list" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                    |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------------|--------------------|
  |Save             |cases list has been saved. This is now your current cohort.  |Remove Modal        |
