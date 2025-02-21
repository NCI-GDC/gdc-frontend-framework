# Download Center - Table Downloads Buttons
Date Created  : 12/21/2022
Version			  : 1.2
Owner		      : GDC QA
Description		: JSON, TSV, Manifest, Metadata, Sample Sheet Downloads

tags: gdc-data-portal-v2, repository, json-tsv-file-download, download, regression

## Navigate to Cohort Builder and Select Filters
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"
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

## Download and Read Metadata file
* Navigate to "Downloads" from "Header" "section"
* Download "Metadata Files Table" from "Repository"
* Read from "Metadata Files Table from Repository"
* Verify that "Metadata Files Table from Repository" has expected information
  |required_info                        |
  |-------------------------------------|
  |7496e516-00ca-4efc-890e-301ac98d2a38 |
  |4e446a5e-6747-4a67-8261-9d3747bf7a0d.targeted_sequencing.aliquot.maf.gz|
  |Targeted Sequencing                  |
  |MAF                                  |
  |controlled                           |
  |AD16392_aliquot                      |
  |AD16392_AggregatedSomaticMutation    |
  |Simple Nucleotide Variation          |
  |Illumina                             |
  |25710187-f1df-48a3-942d-de443305830d |
  |f3be05b5-bd69-49ad-a7a2-243e9f525f10 |

## Validate Metadata fields
  |field_name                             |
  |---------------------------------------|
  |data_format                            |
  |access                                 |
  |associated_entities.entity_submitter_id|
  |eassociated_entities.entity_type       |
  |associated_entities.case_id            |
  |associated_entities.entity_id          |
  |file_name                              |
  |submitter_id                           |
  |data_category                          |
  |analysis.updated_datetime              |
  |analysis.workflow_link                 |
  |analysis.submitter_id                  |
  |analysis.state                         |
  |analysis.workflow_type                 |
  |analysis.analysis_id                   |
  |analysis.created_datetime              |
  |platform                               |
  |file_size                              |
  |md5sum                                 |
  |file_id                                |
  |data_type                              |
  |state                                  |
  |experimental_strategy                  |
* Verify that the "Metadata Files Table from Repository" has <field_name> for each object

## Download and Read Sample Sheet file
* Navigate to "Downloads" from "Header" "section"
* Download "Sample Sheet Files Table" from "Repository"
* Read from "Sample Sheet Files Table from Repository"
* Verify that "Sample Sheet Files Table from Repository" has expected information
  |required_info                        |
  |-------------------------------------|
  |File ID                              |
  |File Name                            |
  |Data Category                        |
  |Data Type                            |
  |Project ID                           |
  |Case ID                              |
  |Sample ID                            |
  |Tissue Type                          |
  |Tumor Descriptor                     |
  |Specimen Type                        |
  |Preservation Method                  |
  |Simple Nucleotide Variation          |
  |Annotated Somatic Mutation           |
  |Clinical Supplement                  |
  |FM-AD                                |
  |AD15753                              |
  |AD4073_sample                        |
  |Tumor                                |
  |Primary                              |
  |Unknown                              |
