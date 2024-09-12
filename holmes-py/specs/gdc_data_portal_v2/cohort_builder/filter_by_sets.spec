# Cohort Builder - Filter by Gene and Mutation Set
Date Created    : 09/12/2024
Version	        : 1.0
Owner		        : GDC QA
Description		  : Create Gene and Mutation Sets using filter cards. Filter cohort by them.
Test-case       : PEAR-792

tags: gdc-data-portal-v2, cohort-builder, filter-card, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Gene Set
* Select Create Set and from the dropdown choose "Genes"
* Upload "Filter By Existing Gene Set" "txt" from "Cohort Builder" in "Manage Sets Import" through "Browse"
* Is text "5 submitted gene identifiers mapped to 5 unique GDC genes" present on the page
* Select "Submit"
* Enter "CB-Existing Gene Set" in the text box "Name Input Field"
* Select "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"

## Filter by Existing Gene Set
* Navigate to "Cohort" from "Header" "section"
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Mutated Gene     |Upload Genes         |
* Switch to tab "Saved Sets" in Modal
* Change number of entries shown in the table "Sets" to "100"
* Verify the set "CB-Existing Gene Set" displays a count of "5" in Modal
* Select the following checkboxes
  |checkbox_name        |
  |---------------------|
  |CB-Existing Gene Set |
* Select button "Submit"
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |CB-Existing Gene Set                   |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Mutated Gene         |CB-Existing Gene Set                   |1                        |
* Collect Cohort Bar Case Count for comparison
* Navigate to "Analysis" from "Header" "section"
* Collect these tool card case counts for comparison
  |tool_card          |
  |-------------------|
  |Mutation Frequency |
* Verify "Cohort Bar Case Count" and "Mutation Frequency Tool Card Case Count" are "Equal"
* Navigate to "Cohort" from "Header" "section"
* Remove these filters from the cohort query area
  |Filter to Remove             |
  |-----------------------------|
  |Gene Id                      |
* Validate expected custom filters "are not" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |CB-Existing Gene Set                   |
