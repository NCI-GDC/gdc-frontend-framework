# End to End - ABSOLUTE CNV Data
Date Created        : 08/26/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : CNV Index Points to ABSOLUTE
Test-case           :

tags: gdc-data-portal-v2, end-to-end, regression

## Navigate to Repository
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## ABSOLUTE LiftOver Workflow Type
* Make the following selections on a filter card
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Workflow Type        |ABSOLUTE LiftOver    |
* Collect "Files" Count on the Repository page
* Collect file counts for the following filters on the Repository page
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Data Category        |copy number variation|
* Verify "Data Category_copy number variation Repository Count" and "Files Count Repository Page" are "Equal"

## ASCAT3 Workflow Type
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Data Type            |clear selection      |
* Make the following selections on a filter card
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Workflow Type        |ASCAT3               |
* Collect "Files" Count on the Repository page
* Collect file counts for the following filters on the Repository page
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Data Category        |copy number variation|
* Verify "Data Category_copy number variation Repository Count" and "Files Count Repository Page" are "Equal"

## ASCAT2 Workflow Type
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Data Type            |clear selection      |
* Make the following selections on a filter card
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Workflow Type        |ASCAT2               |
* Collect "Files" Count on the Repository page
* Collect file counts for the following filters on the Repository page
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Data Category        |copy number variation|
* Verify "Data Category_copy number variation Repository Count" and "Files Count Repository Page" are "Equal"

## AscatNGS Workflow Type
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Data Type            |clear selection      |
* Make the following selections on a filter card
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Workflow Type        |AscatNGS             |
* Collect "Files" Count on the Repository page
* Collect file counts for the following filters on the Repository page
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Data Category        |copy number variation|
* Verify "Data Category_copy number variation Repository Count" and "Files Count Repository Page" are "Equal"

## Validate ABSOLUTE CNV File
* Quick search for "d6075e72-7adb-4aab-8100-5030f37912d2" and go to its page
* Verify the table "Analysis File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |ABSOLUTE LiftOver                      |
* Verify the table "Data Information File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Copy Number Variation                  |
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |d6075e72-7adb-4aab-8100-5030f37912d2   |
    |8eec0f729d244d2b6280ae47f720da06       |
    |3427880                                |
* Read file content from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |ENSG00000223972.5                      |
    |RNU6-1095P                             |
    |ENSG00000264490.3                      |
    |b713b5b5-ecc3-5732-a334-4de313844399   |
    |Item in special subset	                |
    |This is part of the ovarian triplet set.|

## Validate ASCAT2 CNV File
* Quick search for "d5eaa446-d344-4c80-978c-ad02cf87ebf0" and go to its page
* Verify the table "Analysis File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |ASCAT2                                 |
* Verify the table "Data Information File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Copy Number Variation                  |
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |d5eaa446-d344-4c80-978c-ad02cf87ebf0   |
    |4c6f634a675605da86bd04ec874a5b5d       |
    |3511                                   |
* Read file content from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |GDC_Aliquot                            |
    |Major_Copy_Number                      |
    |fc438819-9ec3-46ba-b5ad-348ea9c3d859   |
    |chrY                                   |
