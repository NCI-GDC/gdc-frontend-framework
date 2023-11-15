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
  |category       |
  |---------------|
  |Cases          |

## Navigate to Mutation Frequency App
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Create Blank Cohort for Testing Purposes
* Wait for loading spinner
* Select "Add" from the Cohort Bar
* Name the cohort "Blank - Mutation Frequency" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Create           |Blank - Mutation Frequency                 |Remove Modal        |

## Genes - SSM Affected Cases in Cohort
* Search the table for "PTEN"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |PTEN         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |6     |
* Name the cohort "PTEN SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                          |Keep or Remove Modal|
  |-----------------|---------------------------------------------------|--------------------|
  |Create           |PTEN SSM Affected Cases in Cohort has been created |Remove Modal        |
* Switch cohort to "PTEN SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "PTEN SSM Affected Cases in Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Ssm Id is          |exists               |3                        |
  |Gene               |PTEN                 |4                        |
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "PTEN SSM Affected Cases in Cohort" should be the active cohort

## Genes - CNV Gain
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Search the table for "CSMD3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |CSMD3        |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |8     |
* Name the cohort "CSMD3 CNV Gain" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                          |Keep or Remove Modal|
  |-----------------|---------------------------------------------------|--------------------|
  |Create           |CSMD3 CNV Gain has been created                    |Remove Modal        |
* Switch cohort to "CSMD3 CNV Gain" from the Cohort Bar dropdown list
* "CSMD3 CNV Gain" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Cnv Change         |=gain                |3                        |
  |Gene Id            |=CSMD3               |4                        |
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "CSMD3 CNV Gain" should be the active cohort

## Genes - CNV Loss
* Switch cohort to "Blank - Mutation Frequency" from the Cohort Bar dropdown list
* "Blank - Mutation Frequency" should be the active cohort
* Search the table for "ZFHX3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |ZFHX3        |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |9     |
* Name the cohort "ZFHX3 CNV Loss" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                          |Keep or Remove Modal|
  |-----------------|---------------------------------------------------|--------------------|
  |Create           |ZFHX3 CNV Loss has been created                    |Remove Modal        |
* Switch cohort to "ZFHX3 CNV Loss" from the Cohort Bar dropdown list
* "ZFHX3 CNV Loss" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Cnv Change         |=loss                |3                        |
  |Gene Id            |=ZFHX3               |4                        |
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "ZFHX3 CNV Loss" should be the active cohort


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
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |8     |
* Name the cohort "chr1:g.6197725delT Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                          |Keep or Remove Modal|
  |-----------------|---------------------------------------------------|--------------------|
  |Create           |chr1:g.6197725delT Affected Cases in Cohort        |Remove Modal        |
* Switch cohort to "chr1:g.6197725delT Affected Cases in Cohort" from the Cohort Bar dropdown list
* "chr1:g.6197725delT Affected Cases in Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections                           |position in filter area  |
  |-------------------|-------------------------------------|-------------------------|
  |SSM ID             |78066279-06cf-5b55-bc10-10eeba4ec015 |2                        |
* Verify the "Cohort Bar Case Count" is "Not Equal" to the home page count for "Cases"
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "chr1:g.6197725delT Affected Cases in Cohort" should be the active cohort
