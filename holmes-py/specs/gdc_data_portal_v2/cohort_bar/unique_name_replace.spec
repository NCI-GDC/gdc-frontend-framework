# Cohort Bar - Unique Name and Replacement
Date Created    : 08/21/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Bar Unique Cohort Name and Replacement
Test-case       : PEAR-1460

tags: gdc-data-portal-v2, regression, cohort-bar

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Create, Edit, Save First Cohort
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Primary Site     |adrenal gland        |
* Is text "Changes not saved" present on the page
* Select "Save" from the Cohort Bar
* Name the cohort "Same Cohort Name" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Same Cohort Name" should be the active cohort
* Is text "Changes not saved" not present on the page

## Create, Save, Replace, Edit with Second Cohort
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Program          |CPTAC                |
* Is text "Changes not saved" present on the page
* Select "Save" from the Cohort Bar
* Name the cohort "SaMe CoHoRt NaMe" in the Cohort Bar section
* Select "Save"
* Is text "Replace Existing Cohort" present on the page
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Replace          |Cohort has been saved                      |Remove Modal        |
* Switch cohort to "SaMe CoHoRt NaMe" from the Cohort Bar dropdown list
* "SaMe CoHoRt NaMe" should be the active cohort
* Is text "Changes not saved" not present on the page
* The cohort "Same Cohort Name" should not appear in the cohort dropdown list
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Program          |BEATAML1.0           |

## Create, Save and Replace with Fourth Cohort
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Disease Type     |acinar cell neoplasms|
* Is text "Changes not saved" present on the page
* Select "Save" from the Cohort Bar
* Name the cohort "Same cohort name" in the Cohort Bar section
* Select "Save"
* Is text "Replace Existing Cohort" present on the page
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Replace          |Cohort has been saved                      |Remove Modal        |
* Switch cohort to "Same cohort name" from the Cohort Bar dropdown list
* "Same cohort name" should be the active cohort
* Is text "Changes not saved" not present on the page
* The cohort "SaMe CoHoRt NaMe" should not appear in the cohort dropdown list
