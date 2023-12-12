# Project Page - Create New Cohort Button
Date Created   : 05/30/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Create, Save, Delete Cohort on the Project Page
Test-Case      : PEAR-1291

tags: gdc-data-portal-v2, regression, projects, cohort

## Navigate to Projects Page
* On GDC Data Portal V2 app
* Navigate to "Projects" from "Header" "section"

## Create, Save, Delete Project Page Cohort
* Expand or contract a filter
  |filter_name      |label                |
  |-----------------|---------------------|
  |Program          |plus-icon            |
* Make the following selections on a filter card
  |filter_name      |selection            |
  |-----------------|---------------------|
  |Program          |REBC                 |
* Select value from table by row and column
  |row|column|
  |------|---|
  |1     |1  |
* Select "Create New Cohort" on the Projects page
* Name the cohort "REBC Project Page Cohort"
* Select create or save in cohort modal
* Is modal with text "REBC Project Page Cohort has been created" present on the page and "Keep Modal"
* Set this as your current cohort
* "REBC Project Page Cohort" should be the active cohort
* Is text "Changes not saved" present on the page
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal    |Keep or Remove Modal|
  |-----------------|-----------------------------|--------------------|
  |Save             |Cohort has been saved        |Remove Modal        |
* "REBC Project Page Cohort" should be the active cohort
* Is text "Changes not saved" not present on the page
* Select "Delete" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal    |Keep or Remove Modal|
  |-----------------|-----------------------------|--------------------|
  |Delete           |has been deleted             |Remove Modal        |
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Program          |clear selection      |
