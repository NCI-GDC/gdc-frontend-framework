# Cohort Bar - Discard Changes
Date Created    : 09/13/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Bar Discard Changes
Test-case       : PEAR-1139

tags: gdc-data-portal-v2, regression, cohort-bar

## Collect Data Portal Statistics
* On GDC Data Portal V2 app
* Navigate to "Home" from "Header" "section"
* Collect these data portal statistics for comparison
  |category       |
  |---------------|
  |Cases          |

## Create, Save, Discard with First Cohort
* Navigate to "Cohort" from "Header" "section"
* Select "Add" from the Cohort Bar
* Name the cohort "Discard Changes Cohort" in the Cohort Bar section
* "Create" "Discard Changes Cohort has been created" and "remove modal" in the Cohort Bar section
* Make the following selections from "Exposure" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Alcohol History  |not reported         |
* Make the following selections from "Biospecimen" tab on the Cohort Builder page
  |facet_name         |selection            |
  |-------------------|---------------------|
  |Preservation Method|ffpe                 |
* Select "Discard" from the Cohort Bar
* Is text "Discard Changes" present on the page
* Is text "Are you sure you want to permanently discard the unsaved changes?" present on the page
* "Discard" "Cohort changes have been discarded" and "remove modal" in the Cohort Bar section
* "Discard Changes Cohort" should be the active cohort
* Verify the "Cohort Bar Case Count" is "Equal" to the home page count for "Cases"
* Pause "3" seconds
