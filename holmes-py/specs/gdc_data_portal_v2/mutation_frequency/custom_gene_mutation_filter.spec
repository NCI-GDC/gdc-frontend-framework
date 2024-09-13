# Mutation Frequency - Custom Gene and Mutation Filters
Date Created  : 07/14/2023
Version			  : 1.0
Owner		      : GDC QA
Description		: Custom Filtering on the Mutation Frequency App
Test-Case     : PEAR-732

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Manage Sets
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Gene Set
* Select Create Set and from the dropdown choose "Genes"
* Upload "Filter By Existing Gene Set" "txt" from "Mutation Frequency" in "Manage Sets Import" through "Browse"
* Is text "5 submitted gene identifiers mapped to 5 unique GDC genes" present on the page
* Select "Submit"
* Enter "MF-Existing Gene Set" in the text box "Name Input Field"
* Select "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"

## Create Mutation Set
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Filter By Existing Mutation Set" "txt" from "Mutation Frequency" in "Manage Sets Import" through "Browse"
* Is text "5 submitted mutation identifiers mapped to 5 unique GDC mutations" present on the page
* Select "Submit"
* Enter "MF-Existing Mutation Set" in the text box "Name Input Field"
* Select "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"

## Navigate to Mutation Frequency App
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Validate Custom Gene Filters
* Is text "Overall Survival Plot" present on the page
* Select "Genes" in the Mutation Frequency app
* Upload "Custom Gene Filters" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Pause "5" seconds
* Is text "6 submitted gene identifiers mapped to 6 unique GDC genes" present on the page
* Select "Submit"
We are not guaranteed to get a loading spinner here to wait for,
but it usually requires a wait. So I've put 5 seconds.
* Pause "5" seconds
* Is text "- LRP1B Not Mutated Cases" present on the page
* Is text "- LRP1B Mutated (SSM/CNV) Cases" present on the page
* Verify the table body text is correct
  |expected_text                        |row  |column |
  |-------------------------------------|-----|-------|
  |LRP1B                                |1    |4      |
  |FAT3                                 |2    |4      |
  |FAM135B                              |3    |4      |
  |ANK1                                 |4    |4      |
  |RB1                                  |5    |4      |
  |MYH9                                 |6    |4      |
* Verify the page is showing "1 - 6 of 6 genes"
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Mutated Gene         |clear selection      |

## Filter by Existing Gene Set
* Select "Genes" in the Mutation Frequency app
* Switch to tab "Saved Sets" in Modal
* Change number of entries shown in the table "Sets" to "100"
* Verify the set "MF-Existing Gene Set" displays a count of "5" in Modal
* Select the following checkboxes
  |checkbox_name            |
  |-------------------------|
  |MF-Existing Gene Set     |
* Select button "Submit"
* Is text "- MUC16 Not Mutated Cases" present on the page
* Is text "- MUC16 Mutated (SSM/CNV) Cases" present on the page
* Verify the table body text is correct
  |expected_text|row  |column |
  |-------------|-----|-------|
  |MUC16        |1    |4      |
  |ARID1A       |2    |4      |
  |DCC          |3    |4      |
  |FLNA         |4    |4      |
  |STAG2        |5    |4      |
* Verify the page is showing "1 - 5 of 5 genes"
* Verify expected custom filters "are" present in filter card
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |MF-Existing Gene Set                   |
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Mutated Gene         |clear selection      |

## Validate Custom Mutation Filters
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for table loading spinner
* Select "Somatic Mutations" in the Mutation Frequency app
* Upload "Custom Mutation Filters" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Pause "5" seconds
* Is text "4 submitted mutation identifiers mapped to 4 unique GDC mutations" present on the page
* Select "Submit"
* Pause "5" seconds
We are not guaranteed to get a loading spinner here to wait for,
but it usually requires a wait. So I've put 3 seconds.
* Is text "- KRAS G12D Missense Not Mutated Cases" present on the page
* Is text "- KRAS G12D Missense Mutated Cases" present on the page
* Verify the table body text is correct
  |expected_text                       |row  |column |
  |------------------------------------|-----|-------|
  |KRASG12D                            |1    |5      |
  |ACVR2AK437Rfs*5                     |2    |5      |
  |KRASQ61H                            |3    |5      |
  |FGFR3S249C                          |4    |5      |
* Verify the page is showing "1 - 4 of 4 somatic mutations"
* Perform the following actions on a filter card
  |filter_name              |action               |
  |-------------------------|---------------------|
  |Somatic Mutations        |clear selection      |

## Filter by Existing Mutation Set
* Select "Somatic Mutations" in the Mutation Frequency app
* Switch to tab "Saved Sets" in Modal
* Change number of entries shown in the table "Sets" to "100"
* Verify the set "MF-Existing Mutation Set" displays a count of "5" in Modal
* Select the following checkboxes
  |checkbox_name            |
  |-------------------------|
  |MF-Existing Mutation Set |
* Select button "Submit"
* Is text " - IDH1 R132H Missense Not Mutated Cases" present on the page
* Is text "- IDH1 R132H Missense Mutated Cases" present on the page
* Verify the table body text is correct
  |expected_text|row  |column |
  |-------------|-----|-------|
  |IDH1R132H    |1    |5      |
  |TP53R175H    |2    |5      |
  |TP53R282W    |3    |5      |
  |PTENR130G    |4    |5      |
  |MB21D2Q311E  |5    |5      |
* Verify the page is showing "1 - 5 of 5 somatic mutations"
* Verify expected custom filters "are" present in filter card
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Somatic Mutations    |MF-Existing Mutation Set               |
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Somatic Mutations    |clear selection      |
