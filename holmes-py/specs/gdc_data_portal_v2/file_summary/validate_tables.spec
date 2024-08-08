# File Summary - Validate Tables
Date Created        : 07/18/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Various Tables
Test-Case           : PEAR-474, PEAR-476, PEAR-463

tags: gdc-data-portal-v2, regression, file-summary

## Navigate to Summary Page: 0b439a6e-9f34-4d45-8a1a-b76c8e0ca8f3
* On GDC Data Portal V2 app
* Quick search for "0b439a6e-9f34-4d45-8a1a-b76c8e0ca8f3" and go to its page
## Data Information Table
* Verify the table "Data Information File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Data Category                          |
    |Data Type                              |
    |Experimental Strategy                  |
    |Platform                               |
    |Copy Number Variation                  |
    |Raw Intensities                        |
    |Genotyping Array                       |
    |Affymetrix SNP 6.0                     |


## Navigate to Summary Page: e6f75fe2-981d-4ef4-bc58-bed5e715ce8c
* Quick search for "e6f75fe2-981d-4ef4-bc58-bed5e715ce8c" and go to its page
## File Properties Table
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Name                                   |
    |Access                                 |
    |UUID                                   |
    |Data Format                            |
    |Size                                   |
    |MD5 Checksum                           |
    |Project                                |
    |MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.birdseed.data.txt|
    |controlled                             |
    |e6f75fe2-981d-4ef4-bc58-bed5e715ce8c   |
    |TSV                                    |
    |20.85 MB                               |
    |017c3ae9433e7310e97cf0e84077e967       |
    |TCGA-LIHC                              |

## Empty Associcated Cases/Biospecimens Table
table-associated-cases-biospecimens-file-summary
* Verify the table "Associated Cases Biospecimens File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |No cases or biospecimen found.         |

## Analysis Table
* Verify the table "Analysis File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Workflow Type                          |
    |Workflow Completion Date               |
    |Birdseed                               |
    |2023-03-10                             |

## Verify Reference Genome Table is Not Present
* Verify these items are not on the page
    |item_to_validate                               |
    |-----------------------------------------------|
    |Table Reference Genome File Summary            |

## Source Files
* Verify the table "Source Files File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Access                                 |
    |File Name                              |
    |Data Category                          |
    |Data Type                              |
    |Data Format                            |
    |Size                                   |
    |Action                                 |
    |Controlled                             |
    |Copy Number Variation                  |
    |Raw Intensities                        |
    |MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.CEL |
* In table "Source Files File Summary" on row "MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.CEL" select "Download File"
* Is text "Access Alert" present on the page
* Is text "You don't have access to this file. Please login." present on the page
* Select "Close"
* In table "Source Files File Summary" on row "MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.CEL" select "Add Remove Cart"
* Is text "Added MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.CEL to the cart" present on the page
* Close the message
* In table "Source Files File Summary" on row "MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.CEL" select "Add Remove Cart"
* Is text "Removed MESNE_p_TCGAb_401_02_03_04_05_N_GenomeWideSNP_6_F10_1486958.CEL from the cart" present on the page
* Close the message

## Verify Downstream Analysis Table is Not Present
* Verify these items are not on the page
    |item_to_validate                               |
    |-----------------------------------------------|
    |Table Downstream Analyses Files File Summary   |

## Navigate to Summary Page: 593eee9b-bd8e-4672-aed4-24d406b257fa
* Quick search for "593eee9b-bd8e-4672-aed4-24d406b257fa" and go to its page
## Reference Genome Table
* Verify the table "Reference Genome File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Genome Build                           |
    |GRCh38.p0                              |
    |Genome Name                            |
    |GRCh38.d1.vd1                          |

## Navigate to Summary Page: 61ca2fed-0a04-4987-a7fa-a1f7151f3ee1
* Quick search for "61ca2fed-0a04-4987-a7fa-a1f7151f3ee1" and go to its page
## Source Files: Open Access
* Verify the table "Source Files File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Transcriptome Profiling                |
    |Gene Expression Quantification         |
* In table "Source Files File Summary" on row "597f3e18-9281-429c-842e-19eaaffc6842.qc_filtered_feature_bc_matrix.tar.gz" select "Download File" to download file "Open Access Source File 597f3e18"
* Read metadata from compressed "Open Access Source File 597f3e18"
* Verify that "Open Access Source File 597f3e18" has expected information
  |required_info                          |
  |---------------------------------------|
  |b23449fb-b4e2-4816-9f9e-721eed95a124   |
  |2d4e3510d40dec23524673b22bc22ecc       |
  |validated                              |
  |8519124                                |


## Navigate to Summary Page: f924f238-8520-4821-a263-40ca70a47323
* Quick search for "f924f238-8520-4821-a263-40ca70a47323" and go to its page
## Associated Cases Biospecimens Table
* Verify the table "Associated Cases Biospecimens File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Entity ID                              |
    |Entity Type                            |
    |Sample Type                            |
    |Case ID                                |
    |Annotations                            |
* In table "Associated Cases Biospecimens File Summary", search the table for "tcga-72-4237"
* Verify the table "Associated Cases Biospecimens File Summary" is showing "Showing 1 - 1 of 1 associated cases/biospecimen"


## Navigate to Summary Page: c0bb7fd5-e472-4068-b90a-4d6e192b3861
* Quick search for "c0bb7fd5-e472-4068-b90a-4d6e192b3861" and go to its page
## Read Groups
* Verify the table "Read Groups File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Read Group ID                          |
    |Is Paired End                          |
    |Read Length                            |
    |Library Name                           |
    |Sequencing Center                      |
    |Sequencing Date                        |
    |de426b87-5784-4f9e-806d-92ed1824f58e   |
    |b274c3a1-7f64-49fb-8490-619744742924   |
    |ad9a43f8-ec27-4774-975f-6f76a2724cba   |
    |a1973538-39d6-4a8a-87e7-e3def0882e97   |

## Downstream Analyses Files
* Verify the table "Downstream Analyses Files File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Access                                 |
    |File Name                              |
    |Data Category                          |
    |Data Type                              |
    |Data Format                            |
    |Analysis Workflow                      |
    |Size                                   |
    |Action                                 |
    |f34e1c33-cf41-4383-a56a-49c1c41866d1.wxs.pindel.raw_somatic_mutation.vcf.gz|
    |373.44 kB                              |
* In table "Downstream Analyses Files File Summary" on row "b66ff9e0-91d9-41f2-82f7-36d1853ede2b.wxs.mutect2.raw_somatic_mutation.vcf.gz" select "Download File"
* Is text "Access Alert" present on the page
* Is text "You don't have access to this file. Please login." present on the page
* Select "Close"
* In table "Downstream Analyses Files File Summary" on row "b66ff9e0-91d9-41f2-82f7-36d1853ede2b.wxs.mutect2.raw_somatic_mutation.vcf.gz" select "Add Remove Cart"
* Is text "Added b66ff9e0-91d9-41f2-82f7-36d1853ede2b.wxs.mutect2.raw_somatic_mutation.vcf.gz to the cart" present on the page
* Close the message
* In table "Downstream Analyses Files File Summary" on row "b66ff9e0-91d9-41f2-82f7-36d1853ede2b.wxs.mutect2.raw_somatic_mutation.vcf.gz" select "Add Remove Cart"
* Is text "Removed b66ff9e0-91d9-41f2-82f7-36d1853ede2b.wxs.mutect2.raw_somatic_mutation.vcf.gz from the cart" present on the page
* Close the message


## Navigate to Summary Page: 6a499b8a-fe81-4ab3-adfe-a31581efb7e8
* Quick search for "6a499b8a-fe81-4ab3-adfe-a31581efb7e8" and go to its page
## Downstream Analyses Files: Open Access
* In table "Downstream Analyses Files File Summary" on row "TCGA-LIHC.42b4eab1-b538-4a0a-8f1f-91a90979d8a1.ascat3.allelic_specific.seg.txt" select "Download File" to download file "Open Access Downstream Analyses File TCGA-LIHC 42b4eab1"
* Read metadata from compressed "Open Access Downstream Analyses File TCGA-LIHC 42b4eab1"
* Verify that "Open Access Downstream Analyses File TCGA-LIHC 42b4eab1" has expected information
  |required_info                          |
  |---------------------------------------|
  |810ae8e3-c355-4186-a810-67c68d6ad4be   |
  |d8f7e2440ebb7ec558064f92aaa603fc       |
  |validated                              |
  |4469                                   |


## Navigate to Summary Page: d847b5f7-cc33-4008-bd21-91ca1b06c3f1
* Quick search for "d847b5f7-cc33-4008-bd21-91ca1b06c3f1" and go to its page
## File Versions Table
* Verify the table "File Versions File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |File UUID                              |
    |Release Date	                        |
    |Release Number                         |
    |d847b5f7-cc33-4008-bd21-91ca1b06c3f1   |
    |2024-03-29                             |
    |40.0                                   |
    |Current Version                        |

## File Versions Table - Download and Validate TSV
* Download "TSV" from "File Summary File Versions"
* Read from "TSV from File Summary File Versions"
* Verify that "TSV from File Summary File Versions" has expected information
    |required_info                          |
    |---------------------------------------|
    |Version                                |
    |File UUID                              |
    |Release Date                           |
    |Release Number                         |
    |d847b5f7-cc33-4008-bd21-91ca1b06c3f1 Current Version|
    |2024-03-29                             |
    |40.0                                   |
    |19f606e9-704c-4ef0-b5ea-aec7dd83dd97   |
    |2021-09-23                             |
    |30.0                                   |
    |9a5ddf5b-f598-4c6c-b26f-531088534751   |
    |2022-09-28                             |
    |35.0                                   |

## File Versions Table - Download JSON
* Download "JSON" from "File Summary File Versions"
* Read from "JSON from File Summary File Versions"
* Verify that "JSON from File Summary File Versions" has expected information
    |required_info                          |
    |---------------------------------------|
    |9a5ddf5b-f598-4c6c-b26f-531088534751   |
    |4                                      |
    |superseded                             |
    |2022-09-28                             |
    |35.0                                   |
    |d847b5f7-cc33-4008-bd21-91ca1b06c3f1   |
    |6                                      |
    |released                               |
    |2024-03-29                             |
    |40.0                                   |

## File Versions Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |uuid                                     |
  |version                                  |
  |file_change                              |
  |release_date                             |
* Verify that the "JSON from File Summary File Versions" has <field_name> for each object


## Navigate to Summary Page: b19afd49-21c2-4b3f-bdea-3bdc25fafa1f
* Quick search for "b19afd49-21c2-4b3f-bdea-3bdc25fafa1f" and go to its page
## Annotations Table
* Verify the table "Annotations File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Case UUID                              |
    |Entity Type                            |
    |Entity ID                              |
    |Category                               |
    |Classification                         |
    |Created Datetime                       |
* In table "Annotations File Summary", search the table for "2d3a860d-81e6-5ae7-8cee-a8bcf5f07621"
* Verify the table "Annotations File Summary" is showing "Showing 1 - 1 of 1 annotations"
* Verify the table "Annotations File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |49f975ea-a1cf-4a9b-bf13-030c68cc99e4   |
    |TCGA-33-4589                           |
    |Prior malignancy                       |
    |Notification                           |
    |2012-10-31T00:00:00                    |
* In table "Annotations File Summary", search the table for "f516991c-5139-4b3e-b605-5a3d90688209"
* Verify the table "Annotations File Summary" is showing "Showing 1 - 2 of 2 annotations"
* Verify the table "Annotations File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |0e54c4b6-b4ab-5978-97e9-82ecf9a5ab46   |
    |c53f22b1-677b-5528-a438-39d5390e2c68   |
    |History of unacceptable prior treatment related to a prior/other malignancy|

## Annotations Table - Download and Validate TSV
* In table "Annotations File Summary", search the table for "9f1ee78d-f022-5495-b6ad-fa6aa56bafdb"
* Download "TSV" from "File Summary Annotation Table"
* Read from "TSV from File Summary Annotation Table"
* Verify that "TSV from File Summary Annotation Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |UUID                                   |
    |Case UUID                              |
    |Entity Type                            |
    |Entity ID                              |
    |Category                               |
    |Classification                         |
    |Created Datetime                       |
    |9f1ee78d-f022-5495-b6ad-fa6aa56bafdb   |
    |972476b7-d7f3-4865-b978-0c13f29457cb   |
    |History of acceptable prior treatment related to a prior/other malignancy|
    |case                                   |
    |TCGA-22-1000                           |
    |Notification                           |
    |2012-11-10T00:00:00                    |

## Annotations Table - Download JSON
* Download "JSON" from "File Summary Annotation Table"
* Read from "JSON from File Summary Annotation Table"
* Verify that "JSON from File Summary Annotation Table" has expected information
    |required_info                          |
    |---------------------------------------|
    |140098ef-3eec-59d0-bde7-ce23997b25ff   |
    |[intgen.org]: Molecular Results off Spec |
    |399c936e-ba68-4040-98d4-917a87dad603   |
    |TCGA-21-A5DI                           |
    |Case submitted is found to be a recurrence after submission |
    |a172b257-ccbb-55a0-a16f-48115cd57753   |
    |12ff5a02-93fa-5f33-bb20-3ce7fedea7a3   |
    |Notification                           |
    |Approved                               |
    |2012-10-31T00:00:00                    |

## Annotations Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |annotation_id                            |
  |entity_submitter_id                      |
  |notes                                    |
  |entity_type                              |
  |case_id                                  |
  |classification                           |
  |entity_id                                |
  |category                                 |
  |created_datetime                         |
  |status                                   |
  |case_submitter_id                        |
  |project.project_id                       |
  |project.program.name                     |

* Verify that the "JSON from File Summary Annotation Table" has <field_name> for each object


## Navigate to Summary Page: 74388890-3613-4b96-9277-bd9cffe5edb9
* Quick search for "74388890-3613-4b96-9277-bd9cffe5edb9" and go to its page
## Slide Image Viewer
* Is text "Slide Image Viewer" present on the page
* Select "Details" on the Image Viewer page
* Verify details fields and values
  |field_name                       |value                                  |
  |---------------------------------|---------------------------------------|
  |File_id                          |74388890-3613-4b96-9277-bd9cffe5edb9   |
  |Submitter_id                     |TCGA-DB-A75L-01A-01-TS1                |
  |Slide_id                         |4e3d9149-9a75-4628-b339-c5762a699a71   |
  |Percent_tumor_nuclei	            |75                                     |
  |Percent_monocyte_infiltration    |--                                     |
  |Percent_normal_cells	            |10                                     |
  |Percent_stromal_cells	        |50                                     |
  |Percent_eosinophil_infiltration  |--                                     |
  |Percent_lymphocyte_infiltration  |--                                     |
  |Percent_neutrophil_infiltration  |--                                     |
  |Section_location	                |TOP                                    |
  |Percent_granulocyte_infiltration |--                                     |
  |Percent_necrosis	                |--                                     |
  |Percent_inflam_infiltration	    |--                                     |
  |Number_proliferating_cells	    |--                                     |
  |Percent_tumor_cells	            |40                                     |


## Navigate to Summary Page: d032300f-713d-419f-b6b6-ccb34a433adf
* Quick search for "d032300f-713d-419f-b6b6-ccb34a433adf" and go to its page
## Bam Slicing Button
* Select button "Bam Slicing"
* Is text "Access Alert" present on the page
* Is text "You don't have access to this file. Please login." present on the page
* Select "Close"
