# Clinical Data Analysis - Only Show Properties With Data
Date Created  : 10/14/2025
Version			  : 1.0
Owner		      : GDC QA
Description		: Validate behavior of the Only Show Properties With Data button
Test-Case     : PEAR-2529

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Create Cohort for Test
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "cdave_show_properties_with_data" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Biospecimen            |Analyte Type         |cfdna                          |

## Navigate to Clinical Data Analysis
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page
* Expand clinical property sections

## Select 'Only Show Properties With Data' Checkbox
* Select checkbox "Only Show Properties With Data"
* Validate these field switches are not present on the Clinical Data Analysis page
  |field_switch_selector    |
  |-------------------------|
  |Age At Index             |
  |Treatment Effect         |
  |Premature At Birth       |
* Validate these field switches are present on the Clinical Data Analysis page
  |field_switch_selector    |
  |-------------------------|
  |Primary Diagnosis        |
  |Ethnicity                |
* Is text ID "No Properties With Data Treatment" present on the page
* Is text ID "No Properties With Data Exposure" present on the page
* Is text ID "No Properties With Data Other Clinical Attribute" present on the page

## Un-Select 'Only Show Properties With Data' Checkbox
* Select checkbox "Only Show Properties With Data"
* Validate these field switches are present on the Clinical Data Analysis page
  |field_switch_selector    |
  |-------------------------|
  |Age At Index             |
  |Treatment Effect         |
  |Premature At Birth       |

## Hide and Show Filter Panel
* Select button "Hide Show Filters Panel"
* Validate these field switches are not present on the Clinical Data Analysis page
  |field_switch_selector    |
  |-------------------------|
  |Primary Diagnosis        |
* Select button "Hide Show Filters Panel"
* Validate these field switches are present on the Clinical Data Analysis page
  |field_switch_selector    |
  |-------------------------|
  |Primary Diagnosis        |

## Searching with Only Show Properties With Data
* Select checkbox "Only Show Properties With Data"
* Enter "Initial Disease Status" in the text box "CDAVE Search Bar"
* Is text "No results found" present on the page
* Select checkbox "Only Show Properties With Data"
* Is text "The text term used to describe the status of the patient's malignancy when the treatment began." present on the page
