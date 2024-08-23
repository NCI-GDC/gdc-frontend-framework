# Data Release: 41 - Projects Inclusion
Date Created        : 08/22/2024
Version			        : 1.0
Owner		            : GDC QA
Description		      : Projects Introduced in DR-41
Test-Case           : PEAR-1929

tags: gdc-data-portal-v2, data-release

## Project Introduced in this Data Release: MATCH-P
* On GDC Data Portal V2 app
* Quick search for "MATCH-P" and go to its page
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |MATCH-P                                |
    |phs002152                              |
    |Genomic Characterization CS-MATCH-0007 Arm P|

## Manifest Validation: MATCH-P
* Download "Manifest" from "Project Summary"
* Read from "Manifest from Project Summary"
* Verify that "Manifest from Project Summary" has expected information
  |required_info                        |
  |-------------------------------------|
  |a4e51633-13b4-4eeb-a412-134ac4e991ed |
  |1cdf412e-40d3-4d8f-b13e-048c85c82786 |
  |e7187f53-f806-4fb5-bc11-6320535b518f |
  |cb7b58fb-407b-4d74-a1a6-c86069ed5dab |

## Primary Sites Table: MATCH-P
* In table "Primary Sites Project Summary", search the table for "Small intestine"
* Verify the table "Primary Sites Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |complex mixed and stromal neoplasms    |
    |RNA-Seq, WXS                           |

## Project Cohort Save: MATCH-P
* Collect "File Count" on Project Summary page
* Collect "Case Count" on Project Summary page
* Select "Save New Cohort" on Project Summary page
* Name the cohort "MATCH-P" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |MATCH-P has been saved                     |Remove Modal        |
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "MATCH-P" from the Cohort Bar dropdown list
* Navigate to "Downloads" from "Header" "section"
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Case Count Project Summary" are "Equal"
* Collect "Files" Count on the Repository page
* Collect "Cases" Count on the Repository page
* Verify "Files Count Repository Page" and "File Count Project Summary" are "Equal"
* Verify "Cases Count Repository Page" and "Case Count Project Summary" are "Equal"

## Verify New Project Appears in Projects Table: MATCH-C1
* Navigate to "Projects" from "Header" "section"
* Search the table for "MATCH-C1"
* Select "MATCH-C1" projects row on the Projects page
* Download "TSV Projects Table" from "Projects"
* Read from "TSV Projects Table from Projects"
* Verify that "TSV Projects Table from Projects" has expected information
  |required_info|
  |-------------|
  |MATCH-C1     |
  |RNA-Seq,WXS  |
