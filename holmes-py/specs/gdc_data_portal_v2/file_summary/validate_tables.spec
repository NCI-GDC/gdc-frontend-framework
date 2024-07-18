# File Summary - Validate Tables
Date Created        : 07/18/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Various Tables
Test-Case           : PEAR-474, PEAR-476, PEAR-463

tags: gdc-data-portal-v2, regression, file-summary

## Navigate to Summary Page: e6f75fe2-981d-4ef4-bc58-bed5e715ce8c
* On GDC Data Portal V2 app
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

## Reference Genome Table
* Verify the table "Reference Genome File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Genome Build                           |
    |GRCh38.p0                              |
    |Genome Name                            |
    |GRCh38.d1.vd1                          |

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

## Verify Downstream Analysis Table is Not Present
* Verify these items are not on the page
    |item_to_validate                               |
    |-----------------------------------------------|
    |Table Downstream Analyses Files File Summary   |

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

## Navigate to Summary Page: 0b439a6e-9f34-4d45-8a1a-b76c8e0ca8f3
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
