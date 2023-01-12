# Download Center - JSON, TSV File Table downloads
Date Created    : 12/21/2022
Version			: 1.0
Owner		    : GDC QA
Description		: Test JSON download

tags: gdc-data-portal-v2, repository, json-tsv-file-download

## JSON file download - repository

tags: regression, smoke, json-file-download

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Make Cohort selections
tags: json-file-download, cohort-selections

* Make the following selections from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Primary Diagnosis|acinar cell tumor    |
  |Disease Type     |acinar cell neoplasms|

* Pause "1" seconds

## Download and read JSON file
* Navigate to "Downloads" from "Header" "section"
* Download "JSON Files Table" from "Repository"
* Read from "JSON Files Table from Repository"

## Validate JSON file contents
  |field_name              |
  |-------------------------|
  |file_id                  |
  |access                   |
  |file_name                |
  |cases.case_id            |
  |cases.project.project_id |
  |data_category            |
  |data_type                |
  |data_format              |
  |experimental_strategy    |
  |platform                 |
  |file_size                |
  |annotations.annotation_id|
* Verify that the "JSON Files Table from Repository" has <field_name> for each object

Pause "10" seconds

Download and read TSV file
Download "TSV Files Table" from "Repository"

Validate TSV file contents
Verify that the "TSV Files Table from Repository" has the following fields for each file
Pause "10" seconds
