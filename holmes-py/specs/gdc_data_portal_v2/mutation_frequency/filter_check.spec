# Mutation Frequency - Filters
Date Created   : 06/20/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Filtering on the Mutation Frequency App
Test-Case      : PEAR-898, PEAR-916

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Validate Filters Presence
* Verify presence of filter card
  |filter_name            |
  |-----------------------|
  |Mutated Gene           |
  |Somatic Mutations      |
  |Biotype                |
  |VEP Impact             |
  |SIFT Impact            |
  |Polyphen Impact        |
  |Consequence Type       |
  |Type                   |
* Switch to "Mutations" tab in the Mutation Frequency app
* Is text "somatic mutations" present on the page
* Verify presence of filter card
  |filter_name            |
  |-----------------------|
  |Mutated Gene           |
  |Somatic Mutations      |
  |Biotype                |
  |VEP Impact             |
  |SIFT Impact            |
  |Polyphen Impact        |
  |Consequence Type       |
  |Type                   |

## Validate Gene Filters
* Switch to "Genes" tab in the Mutation Frequency app
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Biotype          |lncRNA                               |
  |VEP Impact       |low                                  |
* Wait for table loading spinner
* Verify the page is showing "1 - 2 of 2 genes"
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Biotype          |clear selection      |
  |VEP Impact       |clear selection      |

## Validate Mutation Filters
* Switch to "Mutations" tab in the Mutation Frequency app
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |SIFT Impact      |tolerated_low_confidence             |
  |Polyphen Impact  |probably_damaging                    |
  |Consequence Type |start_lost                           |
* Wait for table loading spinner
* Verify the page is showing "1 - 1 of 1 somatic mutations"
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |SIFT Impact      |clear selection      |
  |Polyphen Impact  |clear selection      |
  |Consequence Type |clear selection      |
