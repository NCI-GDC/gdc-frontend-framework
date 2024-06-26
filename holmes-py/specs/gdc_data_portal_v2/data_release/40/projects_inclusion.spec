# Data Release: 40 - Projects Inclusion
Date Created        : 06/25/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Projects Introduced in DR-40
Test-Case           : PEAR-1930

tags: gdc-data-portal-v2, data-release

## Project Introduced in this Data Release: MATCH-R
* On GDC Data Portal V2 app
* Quick search for "MATCH-R" and go to its page
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |MATCH-R                                |
    |phs002029                              |
    |Genomic Characterization CS-MATCH-0007 Arm R|

## Manifest Validation: MATCH-R
* Download "Manifest" from "Project Summary"
* Read from "Manifest from Project Summary"
* Verify that "Manifest from Project Summary" has expected information
  |required_info                        |
  |-------------------------------------|
  |c5d34d4e-e093-4e0e-a6fe-bc14b1150c69 |
  |b50352eb-5ab2-4a0e-86f7-3705f3a790b1 |
  |5ed1c2e6-a0c2-4a81-b37b-7893a62f7351 |
  |e1fcbfb7-fb00-4411-b064-05633851350f |

## Primary Sites Table: MATCH-R
* In table "Primary Sites Project Summary", search the table for "Skin"
* Verify the table "Primary Sites Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |mature t- and nk-cell lymphomas        |
    |RNA-Seq, WXS                           |

## Project Cohort Save: MATCH-R
* Collect "File Count" on Project Summary page
* Collect "Case Count" on Project Summary page
* Select "Save New Cohort" on Project Summary page
* Name the cohort "MATCH-R" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |MATCH-R has been saved                      |Remove Modal        |
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "MATCH-R" from the Cohort Bar dropdown list
* Navigate to "Downloads" from "Header" "section"
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Case Count Project Summary" are "Equal"
* Collect "Files" Count on the Repository page
* Collect "Cases" Count on the Repository page
* Verify "Files Count Repository Page" and "File Count Project Summary" are "Equal"
* Verify "Cases Count Repository Page" and "Case Count Project Summary" are "Equal"

## Project Introduced in this Data Release: MATCH-Z1I
* Navigate to "Projects" from "Header" "section"
* Search the table for "MATCH-Z1I"
* Select "MATCH-Z1I" projects row on the Projects page
* Download "TSV Projects Table" from "Projects"
* Read from "TSV Projects Table from Projects"
* Verify that "TSV Projects Table from Projects" has expected information
  |required_info|
  |-------------|
  |MATCH-Z1I    |
  |RNA-Seq,WXS  |
