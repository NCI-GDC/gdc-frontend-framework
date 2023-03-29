# Cohort Bar - Save Cohort
Date Created    : 03/29/2023
Version			: 1.0
Owner		    : GDC QA
Description		: Test Cohort Bar - saving a cohort
Test-case       : PEAR-492

tags: gdc-data-portal-v2, regression, cohort-bar

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Save a cohort for the first time
* Make the following selections from "Demographic" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Gender           |female               |
  |Vital Status     |alive                |
* Is text "Changes not saved" present on the page
* Select "Save" from the Cohort Bar
* Name the cohort "test save 1" in the Cohort Bar section
* "Save" "Cohort has been saved" in the Cohort Bar section

* Pause "10" seconds

Ensure that 'All GDC' is the current cohort when this is executed
## Default cohort All GDC should not be discarded, edited, or deleted
   |button_name |
   |------------|
   |Save        |
   |Discard     |
   |Delete      |
* <button_name> should be disabled in the Cohort Bar
