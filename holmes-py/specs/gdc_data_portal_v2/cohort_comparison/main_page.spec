# Cohort Comparison - Main Page
Date Created    : 03/1/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Comparison - Main Page
Test-case       : PEAR-817

tags: gdc-data-portal-v2, regression, cohort-comparison

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Create Cohorts for Comparison
* Create and save a cohort named "CC_Compare_1" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Biospecimen            |Composition          |solid tissue                   |
  |Biospecimen            |Composition          |peripheral whole blood         |
  |Biospecimen            |Composition          |whole bone marrow              |
  |Biospecimen            |Composition          |peripheral blood components nos|
* Create and save a cohort named "CC_Compare_2" with these filters
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Available Data         |Platform             |illumina             |
  |Available Data         |Access               |open                 |
  |Available Data         |Access               |controlled           |
* Collect "CC_Compare_2" Case Count for comparison
* Switch cohort to "CC_Compare_1" from the Cohort Bar dropdown list
* Collect "CC_Compare_1" Case Count for comparison

## Travel to cohort comparison selection screen
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Is text "Select a cohort to compare with CC_Compare_1" present on the page

## Select cohort to compare with and run
* Select cohort "CC_Compare_2" for comparison on the cohort comparison selection screen
* Select "Run"
* Wait for loading spinner
