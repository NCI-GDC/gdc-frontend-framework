# Cohort Comparison - Selection Screen
Date Created    : 02/28/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Comparison - selection screen
Test-case       : PEAR-819

tags: gdc-data-portal-v2, regression, cohort-comparison

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Create Cohorts for Comparison
* Create and save a cohort named "CC_Selection_1" with these filters
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |General                |Program              |TARGET               |
  |Available Data         |Data Category        |clinical             |
* Create and save a cohort named "CC_Selection_2" with these filters
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Treatment              |Treatment Outcome    |complete response    |
  |Treatment              |Treatment Outcome    |unknown              |
  |Treatment              |Treatment Outcome    |partial response     |
  |Treatment              |Treatment Outcome    |treatment ongoing    |
* Collect "CC_Selection_2" Case Count for comparison
* Switch cohort to "CC_Selection_1" from the Cohort Bar dropdown list
* Collect "CC_Selection_1" Case Count for comparison

## Travel to cohort comparison selection screen
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Is text "Select a cohort to compare with CC_Selection_1" present on the page

## Verify selection screen cohort case counts match
* Collect case count of cohort "CC_Selection_2" for comparison on the cohort comparison selection screen
* Verify "CC_Selection_2 Case Count" and "CC_Selection_2 Selection Screen" are "equal"
* Switch cohort to "CC_Selection_2" from the Cohort Bar dropdown list
* Collect case count of cohort "CC_Selection_1" for comparison on the cohort comparison selection screen
* Verify "CC_Selection_1 Case Count" and "CC_Selection_1 Selection Screen" are "equal"

## Validate Instruction Text
* Is text "Display the survival analysis of your cohorts and compare characteristics such as gender, vital status and age at diagnosis. Create cohorts in the Analysis Center." present on the page
* Is text "Select a cohort to compare with CC_Selection_2" present on the page

## Validate Cancel Button on Selection Screen
* Select "Cancel"
* Is text "Core Tools" present on the page
* Is text "Analysis Tools" present on the page
