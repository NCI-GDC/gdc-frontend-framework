# Mutation Frequency - Demo Mode
Date Created    : 07/12/2023
Version		      : 1.0
Owner		        : GDC QA
Description     : Mutation Frequency Demo Mode
Test-Case       : PEAR-914

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Mutation Frequency Demo
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency Demo" from "Analysis" "app"

## Validate Gene Tab Demo
* Wait for loading spinner
* Is text "Demo showing cases with low grade gliomas (TCGA-LGG project)." present on the page
* Is text "- IDH1 Not Mutated Cases" present on the page
* Is text "- IDH1 Mutated Cases" present on the page
* Verify the table body text is correct
  |expected_text                        |row  |column |
  |-------------------------------------|-----|-------|
  |IDH1                                 |1    |4      |
* Verify the table body tooltips are correct
  |expected_tooltip                     |row  |column |
  |-------------------------------------|-----|-------|
  |Feature not available in demo mode   |1    |2      |

## Validate Mutation Tab Demo
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for loading spinner
* Is text "Demo showing cases with low grade gliomas (TCGA-LGG project)." present on the page
* Is text "- IDH1 R132H Missense Not Mutated Cases" present on the page
* Is text "- IDH1 R132H Missense Mutated Cases" present on the page
* Verify the table body text is correct
  |expected_text                        |row  |column |
  |-------------------------------------|-----|-------|
  |chr2:g.208248388C>T                  |1    |4      |
