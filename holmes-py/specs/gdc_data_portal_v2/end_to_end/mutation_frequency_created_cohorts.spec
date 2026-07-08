# End to End - Mutation Frequency Created Cohorts
Date Created        : 07/07/2026
Version			        : 1.0
Owner		            : GDC QA
Description		      : Create Cohorts in Mutation Frequency. Then, travel to and perform actions in different analysis tools.
Test-case           : PEAR-2706

tags: gdc-data-portal-v2, end-to-end, regression

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

## Create Cohorts in MF App for Testing
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Flip the switch on filter card "Is Cancer Gene Census"
* Wait for table loading spinner
* Search the table for "FAT1"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAT1         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "FAT2"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAT2         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "FAT3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAT3         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "FAT4"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAT4         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Pause "3" seconds
* Wait for cohort bar case count loading spinner
* Select "Save" from the Cohort Bar
* Name the cohort "MF_FAT_Gene_Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Keep Modal          |
* "MF_FAT_Gene_Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Mutated Gene       |FAT1FAT2FAT3FAT4     |1                        |
* Collect "MF_FAT_Gene_Cohort" Case Count for comparison


* Switch to "Mutations" tab in the Mutation Frequency app
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* "Unsaved_Cohort" should be the active cohort
* Flip the switch on filter card "Is Cancer Gene Census"
* Wait for table loading spinner
* Search the table for "TP53 R175H"
* Wait for table body text to appear
  |expected_text      |row  |column |
  |-------------------|-----|-------|
  |chr17:g.7675088C>T |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "TP53 R282W"
* Wait for table body text to appear
  |expected_text      |row  |column |
  |-------------------|-----|-------|
  |chr17:g.7673776G>A |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "TP53 R196*"
* Wait for table body text to appear
  |expected_text      |row  |column |
  |-------------------|-----|-------|
  |chr17:g.7674945G>A |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "TP53 Y220C"
* Wait for table body text to appear
  |expected_text      |row  |column |
  |-------------------|-----|-------|
  |chr17:g.7674872T>C |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |

* Select "Save" from the Cohort Bar
* Name the cohort "MF_TP53_Mutations_Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Keep Modal          |
* "MF_TP53_Mutations_Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Ssm Id             |8e30604f-3a45-5533-bdd7-0a435370031853af5705-a17b-555a-92e9-880ce5c14ca0288a8e0d-059a-520c-b457-fc8464e6815489aee9f6-9564-5c6b-bf5b-762620c36719|1                        |
* Collect "MF_TP53_Mutations_Cohort" Case Count for comparison

## Cohort Comparison
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Select cohort "MF_FAT_Gene_Cohort" for comparison on the cohort comparison selection screen
* Run analysis on Cohort Comparison

* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name                                  |
  |-----------------------|---------------------------------|---------------|---------------------------------------------------------|
  |Sex At Birth           |female                           |1              |CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1 Count  |
  |Sex At Birth           |female                           |2              |CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2 Count        |
* Save cohorts from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Cohort Name                                              |
  |-----------------------|---------------------------------|---------------|---------------------------------------------------------|
  |Sex At Birth           |female                           |1              |CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1        |
  |Sex At Birth           |female                           |2              |CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2              |

* Collect case count of cohorts s1 and s2 on the cohort comparison main screen
* Verify "MF_TP53_Mutations_Cohort Case Count" and "Cohort Comparison s1" are "equal"
* Verify "MF_FAT_Gene_Cohort Case Count" and "Cohort Comparison s2" are "equal"


* Navigate to "Cohort" from "Header" "section"
* Switch cohort to "CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1 Count" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Collect case counts for the following filters on the Cohort Builder page for cohort "CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Sex at Birth         |female                         |
* Verify "Cohort Bar Case Count" and "Sex at Birth_female_CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1 Count" are "Equal"

* Switch cohort to "CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2 Count" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Collect case counts for the following filters on the Cohort Builder page for cohort "CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Sex at Birth         |female                         |
* Verify "Cohort Bar Case Count" and "Sex at Birth_female_CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2 Count" are "Equal"

## Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name                                    |
  |-------------------------------------------------|
  |CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1|
  |CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2      |
* Run analysis on Set Operations
* Download "S1 intersect S2" from "Set Operations"
* Read from "S1 intersect S2 from Set Operations"
* Verify that "S1 intersect S2 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |029d5599-d239-4163-a12a-2c7eaf88b88b |
  |398da5c2-d9f2-4eb4-9813-21009d3ad048 |
  |a9b7d7fe-be31-4f71-afee-c1bfdf511888 |
  |f49a8e1e-d247-4c76-ac3b-ad8e5d6b8d18 |
  |ff1407c6-9174-4bae-a19b-d34ca71b898c |
* Verify that "S1 intersect S2 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |1e5c5b1b-3450-4a1f-9e92-bf522b47f23f |
  |8183f0fb-2303-4d7b-bccd-55e5031fc7df |
  |ff004403-8cc5-43e6-bd1c-dde4eb1e6193 |
  |000992ea-8591-4742-b200-2dc611b18870 |
  |61e00782-b709-43b1-a164-ee7f89c867e4 |
  |ac1d3946-fe6c-4bd8-b02c-638799cb0f67 |
  |e68219b0-a9c2-49df-8f0d-db5ea97fd2dc |
  |ffef8d1d-f99d-4cc0-9f49-46488bfca131 |
* Select set "S1 intersect S2" to save as a new set in the Set Operations analysis screen
* Name the cohort "SETOPERATIONS-MF-FEMALE-S1 intersect S2" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |SETOPERATIONS-MF-FEMALE-S1 intersect S2 has been saved|Remove Modal       |
* Verify the table "Summary Set Operations" is displaying this information
  |text_to_validate                                 |
  |-------------------------------------------------|
  |CC_MF_TP53_Mutations_Cohort_Sex At Birth_Female_1|
  |CC_MF_FAT_Gene_Cohort_Sex At Birth_Female_2      |
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                 |
  |-------------------------|
  |S1 intersect S2          |
* Navigate to "Cohort" from "Header" "section"
* Switch cohort to "SETOPERATIONS-MF-FEMALE-S1 intersect S2" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "S1 intersect S2 Count Set Operations" and "Cohort Bar Case Count" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
* Collect case counts for the following filters on the Cohort Builder page for cohort "SETOPERATIONS-MF-FEMALE-S1 intersect S2"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Sex at Birth         |female                         |
* Verify "Cohort Bar Case Count" and "Sex at Birth_female_SETOPERATIONS-MF-FEMALE-S1 intersect S2 Count" are "Equal"

## Clinical Data Analysis
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card               |row  |column |do_not_trim_content|
  |-------------------------------------|----------------------------|-----|-------|-------------------|
  |Sex At Birth_female_R1_C3            |Sex At Birth                |1    |3      |False              |
* Verify "Sex At Birth_female_R1_C3" and "Sex at Birth_female_SETOPERATIONS-MF-FEMALE-S1 intersect S2 Count" are "Equal"

* On the "Sex At Birth" card's table, select value by row and column on the Clinical Data Analysis page
    |row   |column|button_or_checkbox   |
    |------|------|---------------------|
    |1     |1     |checkbox             |
* On the "Sex At Birth" card, select "Save New Cohort Cases Table" button on the Clinical Data Analysis page
* Select "Only Selected Cases" from dropdown menu
* Name the cohort "cDAVE_SETOPERATIONS_Sex At Birth_female" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                          |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------------------|--------------------|
  |Save             |cDAVE_SETOPERATIONS_Sex At Birth_female has been saved.            |Remove Modal        |
* Switch cohort to "cDAVE_SETOPERATIONS_Sex At Birth_female" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Sex At Birth_female_R1_C3" and "Cohort Bar Case Count" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"

## Back to Mutation Frequency
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"
* Search the table for "FAT3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAT3         |1    |4      |
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
  |FAT3 e2e SSM Affected Cases in Cohort|1    |6      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |6     |
* Name the cohort "FAT3 e2e SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |FAT3 e2e SSM Affected Cases in Cohort has been saved |Remove Modal        |
* Switch cohort to "FAT3 e2e SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "FAT3 e2e SSM Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "FAT3 e2e SSM Affected Cases in Cohort" are "Equal"
* Verify "Cohort Bar Case Count" and "Home Page Cases Count" are "Not Equal"
