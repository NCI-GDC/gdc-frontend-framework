# Project Page - Download JSON, TSV Filter Table Downloads
Date Created   : 05/25/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : JSON, TSV Downloads on the project page
Test-Case      : PEAR-1290

tags: gdc-data-portal-v2, regression, projects, download

## Navigate to Projects Page
* On GDC Data Portal V2 app
* Navigate to "Projects" from "Header" "section"

## Download TSV
* Verify the page is showing "1 - 20"
* Expand or contract a filter
  |filter_name      |label                |
  |-----------------|---------------------|
  |Program          |plus-icon            |
* Make the following selections on a filter card
  |filter_name      |selection            |
  |-----------------|---------------------|
  |Program          |CMI                  |
* Download "TSV Projects Table" from "Projects"
* Read from "TSV Projects Table from Projects"
* Verify that "TSV Projects Table from Projects" has expected information
  |required_info|
  |-------------|
  |Project      |
  |Disease Type |
  |Primary Site |
  |Program      |
  |Cases        |
  |Experimental Strategy  |
  |CMI-MBC      |
  |CMI-MPC      |
  |CMI-ASC      |
  |Breast       |
  |Lymph nodes  |
  |Skin         |
  |Heart        |
  |WXS,RNA-Seq  |
* Verify that "TSV Projects Table from Projects" does not contain specified information
  |required_info  |
  |---------------|
  |FM             |
  |GENIE          |
  |HCMI           |
  |TARGET         |
  |BEATAML        |
  |TCGA           |

## Download and Read JSON file
* Download "JSON Projects Table" from "Projects"
* Read from "JSON Projects Table from Projects"
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Program          |clear selection      |

## Validate JSON file contents
  |field_name                                           |
  |-----------------------------------------------------|
  |project_id                                           |
  |summary                                              |
  |summary.file_count                                   |
  |summary.data_categories.case_count                   |
  |summary.data_categories.data_category                |
  |summary.experimental_strategies.case_count           |
  |summary.experimental_strategies.experimental_strategy|
  |summary.case_count                                   |
  |primary_site                                         |
  |disease_type                                         |
  |program                                              |
  |program.name                                         |
* Verify that the "JSON Projects Table from Projects" has <field_name> for each object
