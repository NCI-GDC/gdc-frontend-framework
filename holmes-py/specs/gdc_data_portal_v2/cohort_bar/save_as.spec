# Cohort Bar - Save As
Date Created    : 01/8/2024∂
Version			: 1.0
Owner		    : GDC QA
Description		: Cohort Bar - Save As Feature
Test-case       :

tags: gdc-data-portal-v2, regression, cohort-bar

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Add, Edit, Save First Cohort
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Make the following selections from "Disease Status and History" tab on the Cohort Builder page
  |facet_name                   |selection            |
  |-----------------------------|---------------------|
  |Prior Malignancy             |no                   |
  |Progression or Recurrence    |not reported         |
  |Synchronous Malignancy       |no                   |
* Validate the cohort query filter area has these filters
  |facet_name                   |selection            |position in filter area  |
  |-----------------------------|---------------------|-------------------------|
  |Prior Malignancy             |no                   |1                        |
  |Progression or Recurrence    |not reported         |2                        |
  |Synchronous Malignancy       |no                   |3                        |
* Select "Save" from the Cohort Bar
* Name the cohort "Save as test - step 1" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Save as test - step 1" should be the active cohort
* Is text "Changes not saved" not present on the page

## Edit and Save As Cohort
* Remove these filters from the cohort query area
  |Filter to Remove             |
  |-----------------------------|
  |Progression or Recurrence    |
* Make the following selections from "Biospecimen" tab on the Cohort Builder page
  |facet_name                   |selection            |
  |-----------------------------|---------------------|
  |Tissue Type                  |tumor                |
* Validate the cohort query filter area has these filters
  |facet_name                   |selection            |position in filter area  |
  |-----------------------------|---------------------|-------------------------|
  |Prior Malignancy             |no                   |1                        |
  |Synchronous Malignancy       |no                   |2                        |
  |Tissue Type                  |tumor                |3                        |
* Validate the cohort query filter does not have these filters
  |facet_name                   |selections           |
  |-----------------------------|---------------------|
  |Progression or Recurrence    |not reported         |
* Select "Save As" from the Cohort Bar
* Name the cohort "Save As Cohort - step 2" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Save As Cohort - step 2" should be the active cohort
* Is text "Changes not saved" not present on the page
* Validate the cohort query filter area has these filters
  |facet_name                   |selection            |position in filter area  |
  |-----------------------------|---------------------|-------------------------|
  |Prior Malignancy             |no                   |1                        |
  |Synchronous Malignancy       |no                   |2                        |
  |Tissue Type                  |tumor                |3                        |
* Validate the cohort query filter does not have these filters
  |facet_name                   |selections           |
  |-----------------------------|---------------------|
  |Progression or Recurrence    |not reported         |
* "Save" should be "disabled" in the Cohort Bar
* "Save As" should be "enabled" in the Cohort Bar
* Pause "3" seconds

## Switch Back to Original Cohort and Validate
* Switch cohort to "Save as test - step 1" from the Cohort Bar dropdown list
* "Save as test - step 1" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name                   |selection            |position in filter area  |
  |-----------------------------|---------------------|-------------------------|
  |Prior Malignancy             |no                   |1                        |
  |Progression or Recurrence    |not reported         |2                        |
  |Synchronous Malignancy       |no                   |3                        |
* Validate the cohort query filter does not have these filters
  |facet_name                   |selections           |
  |-----------------------------|---------------------|
  |Tissue Type                  |tumor                |
