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
Note: This is to resolve flaky test
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |1     |1     |
* Pause "1" seconds
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
Note: This is to resolve flaky test
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |1     |1     |
* Pause "1" seconds
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

## Genes - CNV Amplifications
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Search the table for "PTCH1"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |PTCH1        |1    |4      |
Note: This is to resolve flaky test
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |1     |1     |
* Pause "1" seconds
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |PTCH1 CNV Amplifications             |1    |8      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |8     |
* Name the cohort "PTCH1 CNV Amplifications" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |PTCH1 CNV Amplifications has been saved              |Remove Modal        |
* Switch cohort to "PTCH1 CNV Amplifications" from the Cohort Bar dropdown list
* "PTCH1 CNV Amplifications" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "PTCH1 CNV Amplifications" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Search the table for ""

## Genes - CNV Homozygous Deletions
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Search the table for "NF1"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |NF1          |1    |4      |
Note: This is to resolve flaky test
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |1     |1     |
* Pause "1" seconds
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |NF1 CNV Homozygous Deletions         |1    |9      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |9     |
* Name the cohort "NF1 CNV Homozygous Deletions" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |NF1 CNV Homozygous Deletions has been saved          |Remove Modal        |
* Switch cohort to "NF1 CNV Homozygous Deletions" from the Cohort Bar dropdown list
* "NF1 CNV Homozygous Deletions" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "NF1 CNV Homozygous Deletions" are "Equal"
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
Note: This is to resolve flaky test
* Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |1     |1     |
* Pause "1" seconds
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
