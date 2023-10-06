# Cohort Bar - Import Cohort
Date Created    : 03/13/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Bar - impoting a cohort
Test-case       : PEAR-499

tags: gdc-data-portal-v2, regression, cohort-bar

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Import Cohort from Data Portal V2 file and Set as Current Cohort
* Select "Upload" from the Cohort Bar
* Upload "organoid" "tsv" from "Cohort Bar" in "Cohort Bar Import" through "Browse"
* Select "Submit"
* Name the cohort "organoid" in the Cohort Bar section
* "Create" "organoid" and "keep modal" in the Cohort Bar section
* Set as current cohort
* The cohort bar case count should be "70"
* Clear active cohort filters
* The cohort bar case count should be "86,513"

## Import Cohort from Data Portal V1 file
* Select "Upload" from the Cohort Bar
* Upload "data portal v1 tcga chol" "tsv" from "Cohort Bar" in "Cohort Bar Import" through "Browse"
* Select "Submit"
* Name the cohort "data portal v1" in the Cohort Bar section
* "Create" "data portal v1" and "remove modal" in the Cohort Bar section

## Import Cohort with all Case Identifiers
* Select "Upload" from the Cohort Bar
* Upload "Cases List" "txt" from "Cohort Bar" in "Cohort Bar Import" through "Browse"
* Select "Submit"
* Name the cohort "cases list" in the Cohort Bar section
* "Create" "cases list" and "remove modal" in the Cohort Bar section
