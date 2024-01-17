# Cohort Bar - Enforce Only One Unsaved Cohort
Date Created      : 01/8/2024∂
Version			      : 1.0
Owner		          : GDC QA
Description		    : Cohort Bar - Enforce there can only be one unsaved cohort at a time
Test-case         : PEAR-1748

tags: gdc-data-portal-v2, regression, cohort-bar

## Add an Unsaved Cohort
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"
* "Add" should be "enabled" in the Cohort Bar
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Add" should be "disabled" in the Cohort Bar
* "Save" should be "enabled" in the Cohort Bar
* "Save As" should be "disabled" in the Cohort Bar

## Save an Unsaved Cohort
* Select "Save" from the Cohort Bar
* Name the cohort "Saved unsaved cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Saved unsaved cohort" should be the active cohort
* Is text "Changes not saved" not present on the page
* "Add" should be "enabled" in the Cohort Bar
* "Save" should be "disabled" in the Cohort Bar
* "Save As" should be "enabled" in the Cohort Bar

## Edit the saved cohort
* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection                    |
  |-----------------|-----------------------------|
  |Laterality       |right                        |
* Is text "Changes not saved" present on the page
* "Add" should be "enabled" in the Cohort Bar
* "Save" should be "enabled" in the Cohort Bar
* "Save As" should be "enabled" in the Cohort Bar

## Delete the Cohort
* Select "Delete" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Delete           |has been deleted.                          |Remove Modal        |
* "Add" should be "enabled" in the Cohort Bar
