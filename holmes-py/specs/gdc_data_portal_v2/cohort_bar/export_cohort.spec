# Cohort Bar - Export Cohort
Date Created    : 03/09/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Bar - exporting a cohort
Test-case       : PEAR-501

tags: gdc-data-portal-v2, regression, cohort-bar, download

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"


## Export All Cases Cohort
* Download "Download" from "Cohort Bar"
* Read from "Download from Cohort Bar"
* Verify that "Download from Cohort Bar" has expected information
  |required_info                          |
  |---------------------------------------|
  |3479c5b5-51ce-57e8-b6e9-bbd99e5b10eb   |
  |2ab50407-5d22-4172-9d6c-c05aa42fc54c   |
  |14db56ef-ec5e-4775-a229-5d83e58e027c   |


## Export a Custom Cohort
* Expand or contract a facet from "General" tab on the Cohort Builder page
  |facet_name       |label                |
  |-----------------|---------------------|
  |Program          |plus-icon            |
* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Program          |VAREPOP              |
* Download "Download" from "Cohort Bar"
* Read from "Download from Cohort Bar"
* Verify that "Download from Cohort Bar" has expected information
  |required_info                          |
  |---------------------------------------|
  |76baac42-666a-47c5-8682-02b73cf6c981   |
  |2e42e3ce-d89f-4df7-aefe-2becdb333b98   |
  |60ed7be9-923c-4bd3-a9c1-04c571e71155   |
  |d23ff1df-c6a5-483b-a0c3-b2202c0508c6   |
  |c1a71467-94f8-40b4-ac4d-fc783c4b4df2   |
  |02b81d5d-4e66-4c66-9b13-8639b25f970c   |
  |fac714b8-b637-4c6c-b3e5-c7e9f0d2dc7b   |
* Verify that "Download from Cohort Bar" does not contain specified information
  |required_info                          |
  |---------------------------------------|
  |3479c5b5-51ce-57e8-b6e9-bbd99e5b10eb   |
  |2ab50407-5d22-4172-9d6c-c05aa42fc54c   |
  |14db56ef-ec5e-4775-a229-5d83e58e027c   |
* Perform the following actions from "General" tab on the Cohort Builder page
  |facet_name       |action                       |
  |-----------------|-----------------------------|
  |Program          |clear selection              |


## Export a Custom Cohort with 0 cases
* Search in a filter card from "Demographic" tab on the Cohort Builder page
  |facet_name       |label                |text  |
  |-----------------|---------------------|------|
  |Age at Diagnosis |input from value     |90    |
* Activate the following objects from "Demographic" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Age at Diagnosis |Apply                |

The automation can move a little too rapidly at this moment, so we pause
to let the UI catch up.
* Pause "2" seconds

* Download "Download" from "Cohort Bar"
* Read from "Download from Cohort Bar"
* Verify that "Download from Cohort Bar" has expected information
  |required_info                          |
  |---------------------------------------|
  |id                                     |
There should be no UUIDs in the '0' cases cohort
* Verify that "Download from Cohort Bar" does not contain specified information
  |required_info                          |
  |---------------------------------------|
  |1                                      |
  |2                                      |
  |3                                      |
  |4                                      |
  |5                                      |
  |6                                      |
  |7                                      |
  |8                                      |
  |9                                      |
* Perform the following actions from "Demographic" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Age at Diagnosis |clear selection      |
* Pause "1" seconds
