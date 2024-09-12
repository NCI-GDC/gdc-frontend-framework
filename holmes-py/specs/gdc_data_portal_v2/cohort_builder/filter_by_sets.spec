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
* Is modal with text "Set has been saved." present on the page and "Remove Modal"

## Filter by Existing Gene Set
* Navigate to "Cohort" from "Header" "section"
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Mutated Gene     |Upload Genes         |
