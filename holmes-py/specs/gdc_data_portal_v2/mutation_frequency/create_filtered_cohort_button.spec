# Mutation Frequency - Create Filtered Cohort Button
Date Created   : 09/17/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Create a Filtered Cohort Using Different Table Buttons
Test-Case      : PEAR-1510

tags: gdc-data-portal-v2, mutation-frequency, regression

## Collect Data Portal Statistics
* On GDC Data Portal V2 app
* Navigate to "Home" from "Header" "section"
* Collect these data portal statistics for comparison
  |category       |name_to_store_statistic  |
  |---------------|-------------------------|
  |Cases          |Home Page Cases Count    |

## Navigate to Mutation Frequency App
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Create Blank Cohort for Testing Purposes
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Select "Save" from the Cohort Bar
* Name the cohort "Blank - Mutation Frequency" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "Blank - Mutation Frequency" should be the active cohort

## Genes - SSM Affected Cases in Cohort
* Search the table for "PTEN"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |PTEN         |1    |4      |
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |PTEN SSM Affected Cases in Cohort    |1    |6      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |6     |
* Name the cohort "PTEN SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |PTEN SSM Affected Cases in Cohort has been saved     |Remove Modal        |
* Switch cohort to "PTEN SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "PTEN SSM Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "PTEN SSM Affected Cases in Cohort" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Search the table for ""

## Genes - SSM Affected Cases in Cohort: With Active Filters
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Consequence Type |3_prime_UTR_variant                  |
* Search the table for "APC"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |APC          |1    |4      |
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |APC SSM Affected Cases in Cohort    |1    |6      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |6     |
* Name the cohort "APC SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |APC SSM Affected Cases in Cohort has been saved      |Remove Modal        |
* Switch cohort to "APC SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "APC SSM Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "APC SSM Affected Cases in Cohort" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Search the table for ""

## Genes - CNV Gain
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Search the table for "CSMD3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |CSMD3        |1    |4      |
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |CSMD3 CNV Gain                       |1    |8      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |8     |
* Name the cohort "CSMD3 CNV Gain" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |CSMD3 CNV Gain has been saved                        |Remove Modal        |
* Switch cohort to "CSMD3 CNV Gain" from the Cohort Bar dropdown list
* "CSMD3 CNV Gain" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CSMD3 CNV Gain" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Search the table for ""

## Genes - CNV Loss
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Search the table for "ZFHX3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |ZFHX3        |1    |4      |
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |ZFHX3 CNV Loss                       |1    |9      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |9     |
* Name the cohort "ZFHX3 CNV Loss" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |ZFHX3 CNV Loss has been saved                        |Remove Modal        |
* Switch cohort to "ZFHX3 CNV Loss" from the Cohort Bar dropdown list
* "ZFHX3 CNV Loss" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "ZFHX3 CNV Loss" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Search the table for ""

## Mutations - Affected Cases in Cohort
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for table loading spinner
* Search the table for "chr1:g.6197725delT"
* Wait for table body text to appear
  |expected_text      |row  |column |
  |-------------------|-----|-------|
  |chr1:g.6197725delT |1    |4      |
* Collect button labels in table for comparison
  |button_label                                 |row  |column |
  |---------------------------------------------|-----|-------|
  |chr1:g.6197725delT Affected Cases in Cohort  |1    |8      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |8     |
* Name the cohort "chr1:g.6197725delT Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                  |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------------|--------------------|
  |Save             |chr1:g.6197725delT Affected Cases in Cohort has been saved |Remove Modal        |
* Switch cohort to "chr1:g.6197725delT Affected Cases in Cohort" from the Cohort Bar dropdown list
* "chr1:g.6197725delT Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "chr1:g.6197725delT Affected Cases in Cohort" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Search the table for ""
