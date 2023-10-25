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

## Discard Changes on Unsaved Cohort
* Navigate to "Cohort" from "Header" "section"
* Select "Add" from the Cohort Bar
* Name the cohort "Discard Changes Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Create           |Discard Changes Cohort has been created    |Remove Modal        |
* Make the following selections from "Exposure" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Alcohol History  |not reported         |
* Make the following selections from "Biospecimen" tab on the Cohort Builder page
  |facet_name         |selection            |
  |-------------------|---------------------|
  |Preservation Method|ffpe                 |
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Alcohol History    |not reported         |1                        |
  |Preservation Method|ffpe                 |2                        |
* Is text "Changes not saved" present on the page
* Select "Discard" from the Cohort Bar
* Is text "Discard Changes" present on the page
* Is text "Are you sure you want to permanently discard the unsaved changes?" present on the page
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Discard          |Cohort changes have been discarded         |Remove Modal        |
* "Discard Changes Cohort" should be the active cohort
* Verify the "Cohort Bar Case Count" is "Equal" to the home page count for "Cases"
* "Discard" should be disabled in the Cohort Bar
* Is text "Changes not saved" not present on the page
* Validate the cohort query filter does not have these filters
  |facet_name         |selections           |
  |-------------------|---------------------|
  |Alcohol History    |not reported         |
  |Preservation Method|ffpe                 |


## Discard Changes on Saved Cohort
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Discard Changes Cohort" should be the active cohort
* "Discard" should be disabled in the Cohort Bar
* "Save" should be disabled in the Cohort Bar
* Make the following selections from "Disease Status and History" tab on the Cohort Builder page
  |facet_name         |selection            |
  |-------------------|---------------------|
  |Residual Disease    |r0                   |
* Is text "Changes not saved" present on the page
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Residual Disease    |r0                   |1                        |
* Select "Discard" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Discard          |Cohort changes have been discarded         |Remove Modal        |
* "Discard Changes Cohort" should be the active cohort
* Verify the "Cohort Bar Case Count" is "Equal" to the home page count for "Cases"
* "Discard" should be disabled in the Cohort Bar
* Is text "Changes not saved" not present on the page
* Validate the cohort query filter does not have these filters
  |facet_name         |selections           |
  |-------------------|---------------------|
  |Residual Disease    |r0                   |

## Discard Changes on an Edited, Saved Cohort
* Make the following selections from "Demographic" tab on the Cohort Builder page
  |facet_name         |selection            |
  |-------------------|---------------------|
  |Ethnicity          |not hispanic or latino|
* Make the following selections from "Stage Classification" tab on the Cohort Builder page
  |facet_name         |selection            |
  |-------------------|---------------------|
  |Igcccg Stage       |good prognosis       |
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Save" should be disabled in the Cohort Bar
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name         |selection            |
  |-------------------|---------------------|
  |Project            |TCGA-TGCT            |
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Ethnicity          |not hispanic or latino|1                       |
  |Igcccg Stage       |good prognosis       |2                        |
  |Project            |TCGA-TGCT            |3                        |
* Is text "Changes not saved" present on the page
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"
* Select "Discard" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Discard          |Cohort changes have been discarded         |Remove Modal        |
* "Discard Changes Cohort" should be the active cohort
* "Discard" should be disabled in the Cohort Bar
* Is text "Changes not saved" not present on the page
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Ethnicity          |not hispanic or latino|1                       |
  |Igcccg Stage       |good prognosis       |2                        |
* Validate the cohort query filter does not have these filters
  |facet_name         |selections           |
  |-------------------|---------------------|
  |Project            |TCGA-TGCT            |
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"

## Discard Changes from Clear All Filters
* Clear active cohort filters
* Verify the "Cohort Bar Case Count" is "Equal" to the home page count for "Cases"
* Is text "Changes not saved" present on the page
* Validate the cohort query filter does not have these filters
  |facet_name         |selections           |
  |-------------------|---------------------|
  |Ethnicity          |not hispanic or latino|
  |Igcccg Stage       |good prognosis       |
* Select "Discard" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Discard          |Cohort changes have been discarded         |Remove Modal        |
* "Discard Changes Cohort" should be the active cohort
* "Discard" should be disabled in the Cohort Bar
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"
* Is text "Changes not saved" not present on the page
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Ethnicity          |not hispanic or latino|1                       |
  |Igcccg Stage       |good prognosis       |2                        |
