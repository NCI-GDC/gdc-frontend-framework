# Cohort Builder - General, Range, Date, String facet card testing
Date Created    : 02/10/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - card functions
Test-case       : PEAR-792

tags: gdc-data-portal-v2, cohort-builder, filter-card, regression

## Navigate to Cohort Builder

tags: regression, smoke, cohort-builder

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - General Card Functions
tags: cohort-selections
* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8010/3               |
* Is checkbox checked
  |checkbox_id          |
  |---------------------|
  |8010/3               |
* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8010/3               |
* Is checkbox not checked
  |checkbox_id          |
  |---------------------|
  |8010/3               |
* Perform the following actions from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |action                 |
  |-----------------|-----------------------|
  |Morphology       |Sort Cases numerically |
  |Morphology       |Sort Cases numerically |
* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8140/3               |
* Perform the following actions from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |action                   |
  |-----------------|-------------------------|
  |Morphology       |Sort name alphabetically |
* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8010/3               |
* Perform the following actions from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |action                       |
  |-----------------|-----------------------------|
  |Morphology       |Chart view                   |
  |Morphology       |clear selection              |
  |Morphology       |Search                       |
  |Morphology       |Selection view               |
* Search in a filter card from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |label                |text  |
  |-----------------|---------------------|------|
  |Morphology       |search values        |9861/3|
* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |9861/3               |
  |Morphology       |9861/3               |
* Expand or contract a facet from "Available Data" tab on the Cohort Builder page
  |facet_name       |label                |
  |-----------------|---------------------|
  |Data Format      |plus-icon            |
* Make the following selections from "Available Data" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Data Format       |xlsx                |
* Expand or contract a facet from "Available Data" tab on the Cohort Builder page
  |facet_name       |label                |
  |-----------------|---------------------|
  |Data Format      |minus-icon           |
* Perform the following actions from "Available Data" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Data Format      |clear selection      |
* Clear active cohort filters
* Make the following selections from "Disease Status and History" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Prior Treatment  |no                   |


## Cohort Builder - Range Card Functions
* Clear active cohort filters
* Search in a filter card from "Demographic" tab on the Cohort Builder page
  |facet_name       |label                |text  |
  |-----------------|---------------------|------|
  |Age at Diagnosis |input from value     |59    |
  |Age at Diagnosis |input to value       |71    |
* Select the following labels from "Demographic" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Age at Diagnosis |Apply                |
* Select the following radio buttons
  |radio_id                                           |
  |---------------------------------------------------|
  |cases.diagnoses.age_at_diagnosis_21915.0-25568.0_1 |
* Perform the following actions from "Demographic" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Age at Diagnosis |clear selection      |

## Cohort Builder - Date Card Functions
* Clear active cohort filters
* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
  |filter_name      |
  |-----------------|
  |created_datetime |
* Search in a filter card from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |label                  |text      |
  |-----------------|-----------------------|----------|
  |Created Datetime |input since value      |1959-09-22|
  |Created Datetime |input through value    |11/30/95  |
* Validate the cohort query filter area has these filters
  |facet_name         |selections                 |position in filter area  |
  |-------------------|---------------------------|-------------------------|
  |Created Datetime   |>=1959-09-22and<=1995-11-30|1                        |
* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Created Datetime |Remove the facet     |
* Pause "1" seconds


## Cohort Builder - String Card Functions
* Clear active cohort filters
* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
  |filter_name      |
  |-----------------|
  |case_id          |
* Search in a filter card from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |label                         |text                                   |
  |-----------------|------------------------------|---------------------------------------|
  |Case Id          |add filter value              |9e15d908-12c2-5a1b-b1c4-c328242d474a   |
* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |label                         |
  |-----------------|------------------------------|
  |Case Id          |add string value              |
* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Case Id          |Remove the facet     |
