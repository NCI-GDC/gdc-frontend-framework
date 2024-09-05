# End to End - Expression Array
Date Created        : 08/22/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Test New Experimental Strategy Expression Array
Test-case           :

tags: gdc-data-portal-v2, end-to-end, regression

## Navigate to Summary Page: dc60add8-9c21-4d98-bd3d-93ccf5ded9b9
* On GDC Data Portal V2 app
* Quick search for "dc60add8-9c21-4d98-bd3d-93ccf5ded9b9" and go to its page

## File Properties Table
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |dc60add8-9c21-4d98-bd3d-93ccf5ded9b9   |
    |72620273481fc24315f1b38f6c16501d       |
    |TCGA-OV                                |
    |5.54 MB                                |
## Data Information Table
* Verify the table "Data Information File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Transcriptome Profiling                |
    |Raw Intensities                        |
    |Expression Array                       |
    |GeneChip U133A                         |
## File Versions Table
* Verify the table "File Versions File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |dc60add8-9c21-4d98-bd3d-93ccf5ded9b9Current Version|
    |2024-08-28	                            |
    |41.0                                   |
## File Versions Table - Download and Validate TSV
* Download "TSV" from "File Summary File Versions"
* Read from "TSV from File Summary File Versions"
* Verify that "TSV from File Summary File Versions" has expected information
    |required_info                          |
    |---------------------------------------|
    |dc60add8-9c21-4d98-bd3d-93ccf5ded9b9 Current Version|
    |2024-08-28	                            |
    |41.0                                   |
## Download File - dc60add8-9c21-4d98-bd3d-93ccf5ded9b9
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                        |
    |-------------------------------------|
    |dc60add8-9c21-4d98-bd3d-93ccf5ded9b9 |
    |72620273481fc24315f1b38f6c16501d     |
    |5536302                              |
* Read file content from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                        |
    |-------------------------------------|
    |b713b5b5-ecc3-5732-a334-4de313844399 |
    |72f1db4f-9ded-537c-b92c-5c653817a1e3 |
    |875ceb04-a15a-5d39-9920-89154b0abda1 |
    |aliquot                              |
    |Item is noncanonical                 |
    |2011-01-28T00:00:00                  |
    |This is part of the ovarian triplet set.|

## Navigate to Summary Page: 7d4ea40b-509a-4ce3-ad7a-9780319daae9
* On GDC Data Portal V2 app
* Quick search for "7d4ea40b-509a-4ce3-ad7a-9780319daae9" and go to its page
## Download File - 7d4ea40b-509a-4ce3-ad7a-9780319daae9
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                        |
    |-------------------------------------|
    |7d4ea40b-509a-4ce3-ad7a-9780319daae9 |
    |6622ede802c50174459823c08dd95a70     |
    |13396139                             |
* Read file content from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                        |
    |-------------------------------------|
    |cb6e1a1b-a932-573e-9a96-6a36be3cf742 |
    |case                                 |
    |Neoadjuvant therapy                  |
    |Notification                         |
    |2011-07-27T00:00:00                  |
    |Subject positive for neoadjuvant therapy.|

## Save Cohort: Expression Array
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "ES-Expression Array" with these filters
    |tab_name               |facet_name           |selection                      |
    |-----------------------|---------------------|-------------------------------|
    |Available Data         |Experimental Strategy|Expression Array               |
* Collect Cohort Bar Case Count for comparison

## Repository Page
When the filters are fixed add tests for them - PEAR-1350
* Navigate to "Downloads" from "Header" "section"
* Pause "4" seconds
* Wait for table loading spinner
* Collect "Cases" Count on the Repository page
* Verify "Cohort Bar Case Count" and "Cases Count Repository Page" are "Equal"
* Make the following selections on a filter card on the Repository page
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Experimental Strategy|Expression Array     |
* Collect "Files" Count on the Repository page
* Collect file counts for the following filters on the Repository page
  |facet_name                   |selection            |
  |-----------------------------|---------------------|
  |Experimental Strategy        |Expression Array     |
* Verify "Experimental Strategy_Expression Array Repository Count" and "Files Count Repository Page" are "Equal"
