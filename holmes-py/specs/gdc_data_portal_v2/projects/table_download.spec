# Project Page - Download JSON, TSV Filter Table Downloads
Date Created   : 05/25/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : JSON, TSV Downloads on the project page
Test-Case      : PEAR-1290

tags: gdc-data-portal-v2, regression, projects, download, smoke-test

## Navigate to Projects Page
* On GDC Data Portal V2 app
* Navigate to "Projects" from "Header" "section"

## Download and Read TSV
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
  |RNA-Seq,WXS  |
* Verify that "TSV Projects Table from Projects" does not contain specified information
  |required_info|
  |-------------|
  |FM           |
  |GENIE        |
  |HCMI         |
  |TARGET       |
  |BEATAML      |
  |TCGA         |
  |Data Category|
  |data category|
  |simple nucleotide variation  |
  |copy number variation        |
  |transcriptome profiling      |
  |sequencing reads             |

## Download and Read JSON file
* Download "JSON Projects Table" from "Projects"
* Read from "JSON Projects Table from Projects"

## Validate JSON file contents
  |field_name                                           |
  |-----------------------------------------------------|
  |project_id                                           |
  |summary                                              |
  |summary.file_count                                   |
  |summary.experimental_strategies.case_count           |
  |summary.experimental_strategies.experimental_strategy|
  |summary.case_count                                   |
  |primary_site                                         |
  |disease_type                                         |
  |program                                              |
  |program.name                                         |
* Verify that the "JSON Projects Table from Projects" has <field_name> for each object

## Download and Read TSV - Multiple Programs
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Program          |clear selection      |
* Make the following selections on a filter card
  |filter_name      |selection            |
  |-----------------|---------------------|
  |Program          |GENIE                |
  |Program          |BEATAML1.0           |
  |Program          |CGCI                 |
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
  |Experimental Strategy|
  |GENIE-MSK    |
  |GENIE-DFCI   |
  |GENIE-MDA    |
  |GENIE-JHU    |
  |GENIE-UHN    |
  |GENIE-VICC   |
  |GENIE-GRCC   |
  |BEATAML1.0-COHORT|
  |GENIE-NKI    |
  |CGCI-HTMCP-CC|
  |CGCI-BLGSP   |
  |BEATAML1.0-CRENOLANIB|
  |Targeted Sequencing|
  |RNA-Seq      |
  |WGS          |
  |miRNA-Seq    |
  |WXS          |
  |Methylation Array|
  |Myeloid Leukemias|
  |Cervix uteri |
* Verify that "TSV Projects Table from Projects" does not contain specified information
  |required_info|
  |-------------|
  |CMI          |
  |CMI-MBC      |
  |CMI-MPC      |
  |CMI-ASC      |
  |FM           |
  |HCMI         |
  |TCGA         |
  |Data Category|
  |data category|
  |simple nucleotide variation  |
  |copy number variation        |
  |transcriptome profiling      |
  |sequencing reads             |
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Program          |clear selection      |
* Pause "1" seconds
