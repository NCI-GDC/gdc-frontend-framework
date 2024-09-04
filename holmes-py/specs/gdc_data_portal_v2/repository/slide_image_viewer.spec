# Repository Page - Slide Image Viewer
Date Created    : 05/12/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Slide Image Viewer
Test-Case       : PEAR-479

tags: gdc-data-portal-v2, repository, regression, slide-image-viewer

## Navigate to Slide Image Viewer
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"
* Select "View Images" on the Repository page
* Wait for "Image Viewer" to be present on the page

## Validate Slide Image Viewer Displays Correct Number of Cases
* Verify the slide image viewer is showing "10" cases
* Select "Show More" on the Image Viewer page
* Verify the slide image viewer is showing "20" cases

## Search for a Slide and Validate its contents
* Select "Search Icon" on the Image Viewer page
* Search for "TCGA-E2-A14N*" on the Image Viewer page
* Select "Go" on the Image Viewer page
* Select case or slide "TCGA-E2-A14N-01Z-00-DX1" on the Image Viewer page
* Select "Details" on the Image Viewer page
* Verify the slide image viewer is showing "1 of 1" cases
* Verify details fields and values
  |field_name                       |value                                  |
  |---------------------------------|---------------------------------------|
  |File_id                          |0dcc8304-dfd1-4e79-b23f-30f1143c897c   |
  |Submitter_id                     |TCGA-E2-A14N-01Z-00-DX1                |
  |Slide_id                         |d82a9fea-364e-4ec8-bfdb-855aab788d53   |
  |Percent_tumor_nuclei	            |--                                     |
  |Percent_monocyte_infiltration    |--                                     |
  |Percent_normal_cells	            |--                                     |
  |Percent_stromal_cells	          |--                                     |
  |Percent_eosinophil_infiltration  |--                                     |
  |Percent_lymphocyte_infiltration  |--                                     |
  |Percent_neutrophil_infiltration  |--                                     |
  |Section_location	                |Not Reported                           |
  |Percent_granulocyte_infiltration |--                                     |
  |Percent_necrosis	                |--                                     |
  |Percent_inflam_infiltration	    |--                                     |
  |Number_proliferating_cells	      |--                                     |
  |Percent_tumor_cells	            |--                                     |
* Verify the slide image is visible
* Select case or slide "TCGA-E2-A14N-01A-03-TSC" on the Image Viewer page
* Select "Details" on the Image Viewer page
* Verify details fields and values
  |field_name                       |value                                  |
  |---------------------------------|---------------------------------------|
  |File_id                          |2e6bc66b-4ef4-4dee-bffa-7ae0eda53bd6   |
  |Submitter_id                     |TCGA-E2-A14N-01A-03-TSC                |
  |Slide_id                         |f25db7f7-db83-4011-9198-683dbc592da6   |
  |Percent_tumor_nuclei	            |90                                     |
  |Percent_monocyte_infiltration    |--                                     |
  |Percent_normal_cells	            |--                                     |
  |Percent_stromal_cells	          |--                                     |
  |Percent_eosinophil_infiltration  |--                                     |
  |Percent_lymphocyte_infiltration  |--                                     |
  |Percent_neutrophil_infiltration  |--                                     |
  |Section_location	                |TOP                                    |
  |Percent_granulocyte_infiltration |--                                     |
  |Percent_necrosis	                |--                                     |
  |Percent_inflam_infiltration	    |--                                     |
  |Number_proliferating_cells	      |--                                     |
  |Percent_tumor_cells	            |100                                    |
* Verify the slide image is visible

## Remove Search
* Remove search filter "TCGA-E2-A14N*" on the Image Viewer page
* Verify the slide image viewer is showing "10" cases

## Go Back to the Repository Page
* Select "Back" on the Image Viewer page
* Is text "Add All Files to Cart" present on the page
