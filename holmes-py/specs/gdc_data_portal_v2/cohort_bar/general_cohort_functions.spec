# Cohort Bar - Save, Switch, Delete Cohort
Date Created    : 03/29/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Bar - saving, switching, and deleting a cohort
Test-case       : PEAR-492,PEAR-493,PEAR-498

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
* "Save" "Cohort has been saved" and "remove modal" in the Cohort Bar section
* "test save 1" should be the active cohort
* Is text "Changes not saved" not present on the page

## Save a cohort for the second time
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection                    |
  |-----------------|-----------------------------|
  |Disease Type     |adenomas and adenocarcinomas |
* Is text "Changes not saved" present on the page
* Select "Save" from the Cohort Bar
* The secondary Cohort Bar save screen should appear
* "Save" "Cohort has been saved" and "remove modal" in the Cohort Bar section
* "test save 1" should be the active cohort
* Is text "Changes not saved" not present on the page

## Switch cohorts
* Select "Add" from the Cohort Bar
* Name the cohort "Added unsaved cohort" in the Cohort Bar section
* "Create" "Added unsaved cohort has been created" and "remove modal" in the Cohort Bar section
* Switch cohort to "test save 1" from the Cohort Bar dropdown list
* "test save 1" should be the active cohort
* Is text "Changes not saved" not present on the page
* Switch cohort to "Added unsaved cohort" from the Cohort Bar dropdown list
* "Added unsaved cohort" should be the active cohort
* Is text "Changes not saved" present on the page
* Switch cohort to "test save 1" from the Cohort Bar dropdown list
* "test save 1" should be the active cohort

## Delete a saved cohort
* Select "Delete" from the Cohort Bar
* "Delete" "test save 1" and "remove modal" in the Cohort Bar section
* "Added unsaved cohort" should be the active cohort

## Delete an unsaved cohort
* Make the following selections from "Exposure" tab on the Cohort Builder page
  |facet_name               |selection                    |
  |-------------------------|-----------------------------|
  |Tobacco Smoking Status   |1                            |
* Is text "Changes not saved" present on the page
* Select "Delete" from the Cohort Bar
* "Delete" "has been deleted" and "remove modal" in the Cohort Bar section
* "New Unsaved Cohort" should be the active cohort

## Delete New Unsaved Cohort
* "New Unsaved Cohort" should be the active cohort
* Is text "Changes not saved" present on the page
* Select "Delete" from the Cohort Bar
* "Delete" "has been deleted" and "remove modal" in the Cohort Bar section
* "New Unsaved Cohort" should be the active cohort
* Is text "Changes not saved" present on the page
