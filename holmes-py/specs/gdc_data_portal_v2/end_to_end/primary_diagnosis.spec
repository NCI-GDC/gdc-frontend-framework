# End to End - Primary Diagnosis
Date Created    :
Version			    : 2.0
Owner		        : GDC QA
Description		  :
Test-case       : P

tags: gdc-data-portal-v2, end-to-end, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Primary Diagnosis - Validate There Are More Than 250 Filters Available
* Collect counts on more label from the following filters on the Cohort Builder page for cohort "empty"
  |tab_name                 |facet_name                   |
  |-------------------------|-----------------------------|
  |General                  |Primary Diagnosis            |
* Verify "Primary Diagnosis_empty more Count" is "greater than" "250"

## Create Cohort With Many Primary Diagnosis Small Case Filter Values
* Create and save a cohort named "CC_Compare_1" with these filters
  |tab_name               |facet_name           |selection                            |
  |-----------------------|---------------------|-------------------------------------|
  |General                |Primary Diagnosis    |acral lentiginous melanoma, malignant|
  |General                |Primary Diagnosis    |hemangioendothelioma, malignant      |
  |General                |Primary Diagnosis    |epithelial tumor, benign             |
  |General                |Primary Diagnosis    |transitional cell carcinoma in situ  |
  |General                |Primary Diagnosis    |mixed invasive mucinous and non-mucinous adenocarcinoma|
  |General                |Primary Diagnosis    |gastrointestinal stromal tumor, malignant|
  |General                |Primary Diagnosis    |teratoma, malignant, nos             |
  |General                |Primary Diagnosis    |mesothelioma, malignant              |
* Download "Download" from "Cohort Bar"
* Read from "Download from Cohort Bar"
* Verify that "Download from Cohort Bar" has expected information
  |required_info                          |
  |---------------------------------------|
  |e90bfe17-2e5b-47ed-b986-b3d4181f2bf6   |
  |1f91f13c-bc22-4a5b-9c8f-54782d3909a0   |
  |2b3b0ca8-14c6-493e-921a-cd43ba7d080a   |
  |2b740646-7cd4-4c7f-890a-7b3db6ebc1b8   |
  |2dd1ecd8-a8d8-4a6a-8cf2-e847557ab04c   |
  |5a197d56-e835-4f96-ad85-04ae9f6aff32   |
  |8969579c-e8fd-4a0d-8b81-1c2982b857f5   |
  |a90ca2b1-85dc-4911-8385-32d7ac5adfab   |
  |96b055b7-8349-479b-9943-d1eb39e7b2bb   |
  |b85b14d7-3b5a-4800-af12-622ec03b9fe5   |
  |0bf19af6-2295-4adb-86cb-c96f224a6364   |
  |fce3719e-429c-4150-945b-491aaffcf7a4   |
  |b6379552-d318-451f-91d0-934bd6d18533   |
  |a9eb1022-ffd3-42de-a39d-2126fc7ec0ce   |
  |0efd3473-c23d-4788-a601-c600cbe60a32   |
  |7b394c92-c818-4d2b-9ed5-d560581190a7   |
  |67dcde6d-e247-402e-ab27-ba2832b2cc3b   |
  |a75584bc-bef7-48f6-b4b3-c1472a3af768   |
  |a2663a86-a006-4867-9e88-2b523df48303   |
  |de34d3e4-f680-4a33-9403-e77074cd581a   |
  |b2d3f7c0-1ec6-4470-aa9e-ea0a5ec157d7   |
  |00bd0b31-bf64-4489-98a1-0e0780e14056   |

## Clinical Data Analysis - Validate Primary Diagnosis Existence
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page
* Validate the "Primary Diagnosis" analysis card's table contains these values
   |value                                   |
   |----------------------------------------|
   |acral lentiginous melanoma, malignant   |
   |hemangioendothelioma, malignant         |
   |epithelial tumor, benign                |
   |transitional cell carcinoma in situ     |
   |mixed invasive mucinous and non-mucinous adenocarcinoma|
   |gastrointestinal stromal tumor, malignant|
   |teratoma, malignant, nos                |
   |mesothelioma, malignant                 |
