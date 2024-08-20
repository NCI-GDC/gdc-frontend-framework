# Cohort Builder - Filter by Case, Gene, Mutation Identifier
Date Created    : 08/20/2024
Version	        : 1.0
Owner		    : GDC QA
Description		: Test Cohort Builder - Filter by Case, Gene, Mutation Identifier
Test-case       : PEAR-792

tags: gdc-data-portal-v2, cohort-builder, filter-card, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Case ID - Single Identifier
* Select the following labels from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Case ID          |Upload Cases         |
* Upload "One Case" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "1 submitted case identifier mapped to 1 unique GDC case" present on the page
* Select "Submit"
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Case Id              |a757f96a-a173-45e2-a292-62ea007efd9d   |1                        |
* Validate expected custom filters are present in facet cards on the "General" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Case Id              |a757f96a-a173-45e2-a292-62ea007efd9d   |


## Case ID - Multiple Identifiers
* Clear active cohort filters
* Select the following labels from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Case ID          |Upload Cases         |
* Upload "All Case Identifiers" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "12 submitted case identifiers mapped to 12 unique GDC cases" present on the page
* Select "Submit"
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Case Id              |12 input case ids                      |1                        |
* Validate expected custom filters are present in facet cards on the "General" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Case Id              |12 input case ids                      |
