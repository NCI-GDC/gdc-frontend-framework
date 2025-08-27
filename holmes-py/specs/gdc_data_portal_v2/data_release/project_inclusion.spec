# Data Release - Projects Inclusion
Date Created        : 08/04/2024
Version			        : 1.0
Owner		            : GDC QA
Description		      : Project Inclusion in Data Release
Test-Case           : PEAR-1929

tags: gdc-data-portal-v2, data-release

table: resources/data_release/project_inclusion.csv

## Project Introduced in this Data Release
* On GDC Data Portal V2 app
* Quick search for <Project ID> and go to its page
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Project ID>                           |
    |<dbGaP>                                |
    |<Project Name>                         |

* Pause "1" seconds
* Download "Manifest" from "Project Summary"
* Read from "Manifest from Project Summary"
* Verify that "Manifest from Project Summary" has expected information
  |required_info                        |
  |-------------------------------------|
  |<Manifest Info 1>                    |
  |<Manifest Info 2>                    |

* Pause "1" seconds
* In table "Primary Sites Project Summary", search the table for <Primary Site>
* Verify the table "Primary Sites Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Disease Type>                         |
    |<Experimental Strategy>                |

## Project Cohort Save
* Pause "1" seconds
* Collect "File Count" on Project Summary page
* Collect "Case Count" on Project Summary page
* Select "Save New Cohort" on Project Summary page
* Name the cohort <Project ID> in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             | has been saved                            |Remove Modal        |
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to <Project ID> from the Cohort Bar dropdown list
* Navigate to "Downloads" from "Header" "section"
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Case Count Project Summary" are "Equal"
* Collect "Files" Count on the Repository page
* Collect "Cases" Count on the Repository page
* Verify "Files Count Repository Page" and "File Count Project Summary" are "Equal"
* Verify "Cases Count Repository Page" and "Case Count Project Summary" are "Equal"

## Verify New Project Appears in Projects Table
* Navigate to "Projects" from "Header" "section"
* Search the table for <Project ID>
* Select <Project ID> projects row on the Projects page
* Download "TSV Projects Table" from "Projects"
* Read from "TSV Projects Table from Projects"
* Verify that "TSV Projects Table from Projects" has expected information
  |required_info                  |
  |-------------------------------|
  |<Project ID>                   |
  |<All Experimental Strategies>  |
