# Cohort Builder - Filter by Mutation Set
Date Created    : 09/12/2024
Version	        : 1.0
Owner		        : GDC QA
Description		  : Create mutation  set using filter card. Filter cohort by Mutation Sets.
Test-case       : PEAR-792

tags: gdc-data-portal-v2, cohort-builder, filter-card, regression

## Navigate to Manage Sets
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Mutation Set
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Filter By Existing Mutation Set" "txt" from "Cohort Builder" in "Manage Sets Import" through "Browse"
* Is text "5 submitted mutation identifiers mapped to 5 unique GDC mutations" present on the page
* Select "Submit"
* Enter "CB-Existing Mutation Set" in the text box "Name Input Field"
* Select "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"

## Filter Cohort by Existing Mutation Set
* Navigate to "Cohort" from "Header" "section"
* Select "Add" from the Cohort Bar
* Is temporary modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection                  |
  |-----------------|---------------------------|
  |Somatic Mutation |Upload Somatic Mutations   |
* Switch to tab "Saved Sets" in Modal
* Change number of entries shown in the table "Sets" to "100"
* Verify the set "CB-Existing Mutation Set" displays a count of "5" in Modal
* Select the following checkboxes
  |checkbox_name            |
  |-------------------------|
  |CB-Existing Mutation Set |
* Select button "Submit"
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Somatic Mutation     |CB-Existing Mutation Set               |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |SSM ID               |CB-Existing Mutation Set               |1                        |
* Collect Cohort Bar Case Count for comparison
* Navigate to "Analysis" from "Header" "section"
* Collect these tool card case counts for comparison
  |tool_card          |
  |-------------------|
  |Mutation Frequency |
* Verify "Cohort Bar Case Count" and "Mutation Frequency Tool Card Case Count" are "Equal"
* Select "Save" from the Cohort Bar
* Name the cohort "CB-Mutation Set" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "CB-Mutation Set" should be the active cohort

## Filter Cohort by Created Mutation Set in Modal
* Navigate to "Cohort" from "Header" "section"
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection                |
  |-----------------|-------------------------|
  |Somatic Mutation |Upload Somatic Mutations |
* Switch to tab "Enter Mutations" in Modal
* Upload "Filter By New Mutation Set" "txt" from "Cohort Builder" in "Manage Sets Import" through "Browse"
* Is text "5 submitted mutation identifiers mapped to 5 unique GDC mutations" present on the page
* Select button "Save Set"
* Enter "CB-New Mutation Set" in the text box "Name Input Field"
* Select button "Save Name"
* Is temporary modal with text "Set has been saved." present on the page and "Keep Modal"
* Switch to tab "Saved Sets" in Modal
* Select button "Discard"
* Change number of entries shown in the table "Sets" to "100"
* Verify the set "CB-New Mutation Set" displays a count of "5" in Modal
* Select the following checkboxes
  |checkbox_name        |
  |---------------------|
  |CB-New Mutation Set  |
* Select button "Submit"
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Somatic Mutation     |CB-New Mutation Set                    |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                                     |position in filter area  |
  |---------------------|-----------------------------------------------|-------------------------|
  |SSM ID               |CB-Existing Mutation SetCB-New Mutation Set    |1                        |
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* Collect Cohort Bar Case Count for comparison
* Navigate to "Analysis" from "Header" "section"
* Collect these tool card case counts for comparison
  |tool_card          |
  |-------------------|
  |Mutation Frequency |
* Verify "Cohort Bar Case Count" and "Mutation Frequency Tool Card Case Count" are "Equal"

## Validate Created Set's Contents
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table "Manage Sets" to "100"
* Select item list for set "CB-New Mutation Set" on Manage Sets page
* Verify the table "Set Information" is displaying this information
  |text_in_table_to_check               |
  |-------------------------------------|
  |a34dbc69-77ad-5c45-9c4b-e26ea62bde83 |
  |78066279-06cf-5b55-bc10-10eeba4ec015 |
  |fa539267-db47-5b9d-8956-6863c0239acb |
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57 |
  |4fb37566-16d1-5697-9732-27c359828bc7 |
* Close set panel
