# Download Center - JSON, TSV, Manifest File Table downloads
Date Created    : 12/21/2022
Version			: 1.1
Owner		    : GDC QA
Description		: Test JSON, TSV, Manifest Download

tags: gdc-data-portal-v2, repository, json-tsv-file-download, download, regression

## JSON, TSV, Manifest file download - repository
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

## Download and Read JSON file
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

## Download and Read TSV file
* Navigate to "Downloads" from "Header" "section"
* Download "TSV Files Table" from "Repository"
* Read from "TSV Files Table from Repository"
* Verify that "TSV Files Table from Repository" has expected information
  |required_info|
  |-------------|
  |Access       |
  |File Name    |
  |Cases        |
  |Project      |
  |Data Category|
  |Data Format  |
  |File Size    |
  |Annotations  |
* Verify that "TSV Files Table from Repository" does not contain specified information
  |required_info  |
  |---------------|
  |Cart           |
  |cart           |

## Download and Read Manifest file
* Navigate to "Downloads" from "Header" "section"
* Download "Manifest Files Table" from "Repository"
* Read from "Manifest Files Table from Repository"
* Verify that "Manifest Files Table from Repository" has expected information
  |required_info|
  |-------------|
  |id           |
  |filename     |
  |md5          |
  |size         |
  |state        |
  |released     |
These are file states that should never appear in a manifest file
* Verify that "Manifest Files Table from Repository" does not contain specified information
  |required_info  |
  |---------------|
  |registered     |
  |validated      |
  |error          |
  |uploading      |
  |uploaded       |
  |validating     |
  |processing     |
  |processed      |
  |deleted        |
