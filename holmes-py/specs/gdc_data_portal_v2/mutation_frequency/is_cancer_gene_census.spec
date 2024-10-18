# Mutation Frequency - Turn Off 'Is Cancer Gene Census'
Date Created   : 10/10/2024
Version			   : 1.0
Owner		       : GDC QA
Description		 : Turn Off Is Cancer Gene Census
Test-Case      : PEAR-898, PEAR-916

tags: gdc-data-portal-v2, regression, mutation-frequency, is-cancer-census-off

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Create Blank Cohort for Testing Purposes
* Select "Add" from the Cohort Bar
* Is modal with text "Unsaved_Cohort has been created" present on the page and "Remove Modal"
* Select "Save" from the Cohort Bar
* Name the cohort "Blank - MF: ICGC" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |

## Gene - Affected Cases Cohort Create
* Flip the switch on filter card "Is Cancer Gene Census"
* Wait for table loading spinner
* Search the table for "TJP3"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |TJP3         |1    |4      |
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |TJP3 SSM Affected Cases in Cohort    |1    |6      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |6     |
* Name the cohort "TJP3 SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |TJP3 SSM Affected Cases in Cohort has been saved     |Remove Modal        |
* Switch cohort to "TJP3 SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "TJP3 SSM Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "TJP3 SSM Affected Cases in Cohort" are "Equal"
* Search the table for ""

## Download Gene Table TSV
* Flip the switch on filter card "Is Cancer Gene Census"
* Wait for table loading spinner
* Search the table for "ABCA"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |ABCA13       |1    |4      |
* Download "TSV" from "Mutation Frequency"
* Read from "TSV from Mutation Frequency"
* Verify that "TSV from Mutation Frequency" has expected information
  |required_info                      |
  |-----------------------------------|
  |ENSG00000179869                    |
  |ENSG00000251595                    |
  |ABCA3                              |
  |ATP binding cassette subfamily A member 9|
  |17q24.3                            |
  |transcribed_processed_pseudogene   |
  |num_cohort_ssm_affected_cases      |
  |num_cohort_ssm_cases               |
  |cohort_ssm_affected_cases_percentage|
  |num_gdc_ssm_affected_cases         |
  |num_gdc_ssm_cases                  |
  |gdc_ssm_affected_cases_percentage  |
  |num_cohort_cnv_cases               |
  |num_cohort_cnv_gain_cases          |
  |cohort_cnv_gain_cases_percentage   |
  |num_cohort_cnv_loss_cases          |
  |cohort_cnv_loss_cases_percentage   |
  |num_mutations                      |
  |annotations                        |
* Verify that "TSV from Mutation Frequency" does not contain specified information
  |required_info                      |
  |-----------------------------------|
  |TJP3                               |
  |TP53                               |
  |APC                                |
  |FAT4                               |
  |ABCB                               |
  |ABCC                               |

## Gene Table - Select Mutations Filter Button
* Search the table for ""
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |TJP3         |1    |4      |
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |TJP3 Number of Mutations             |1    |10     |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |10    |
* Collect table "Most Frequent Somatic Mutations" Item Count for comparison
* Verify "Most Frequent Somatic Mutations Item Count" and "TJP3 Number of Mutations" are "Equal"

## Mutations Table Filtering
* Search the table for ""
* Switch cohort to "Blank - MF: ICGC" from the Cohort Bar dropdown list
* "Blank - MF: ICGC" should be the active cohort
* Flip the switch on filter card "Is Cancer Gene Census"
* Wait for table loading spinner

* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |VEP Impact       |moderate                             |
* Collect case counts for the following filters for cohort "MF_M_ICGC"
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |VEP Impact       |moderate                             |
* Collect table "Most Frequent Somatic Mutations" Item Count for comparison
* Verify "Most Frequent Somatic Mutations Item Count" and "VEP Impact_moderate_MF_M_ICGC Count" are "Equal"

* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |SIFT Impact      |deleterious                          |
* Collect case counts for the following filters for cohort "MF_M_ICGC"
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |SIFT Impact      |deleterious                          |
* Collect table "Most Frequent Somatic Mutations" Item Count for comparison
* Verify "Most Frequent Somatic Mutations Item Count" and "SIFT Impact_deleterious_MF_M_ICGC Count" are "Equal"

* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Polyphen Impact  |probably_damaging                    |
* Collect case counts for the following filters for cohort "MF_M_ICGC"
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Polyphen Impact  |probably_damaging                    |
* Collect table "Most Frequent Somatic Mutations" Item Count for comparison
* Verify "Most Frequent Somatic Mutations Item Count" and "Polyphen Impact_probably_damaging_MF_M_ICGC Count" are "Equal"

* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |SIFT Impact      |clear selection      |
  |Polyphen Impact  |clear selection      |
  |VEP Impact       |clear selection      |

## Create Mutation Set
* Search the table for "chr3:g.2670991"
* Wait for table body text to appear
  |expected_text        |row  |column |
  |---------------------|-----|-------|
  |chr3:g.26709910C>T   |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |3     |1     |
  |4     |1     |
* Select button "Save Edit Mutation Set"
* Select "Save as new mutation set" from dropdown menu
* Enter "ICGC Off Mutation Set" in the text box "Set Name"
* Select button "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table "Manage Sets" to "100"
* Select item list for set "ICGC Off Mutation Set" on Manage Sets page
* Verify the table "Set Information" is displaying this information
  |text_in_table_to_check               |
  |-------------------------------------|
  |122779a1-4c63-555a-8734-f2414ff9af10 |
  |04590200-7de9-5088-ad9d-c0718120f064 |
  |24d80d1e-a5ca-5456-a470-f86a4c746c0d |
  |329a3a09-e607-54aa-9d85-2bb747a03d0b |
* Close set panel

## Gene Filtering Check
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"
* Switch to "Genes" tab in the Mutation Frequency app
* Is text "Distribution of Most Frequently Mutated Genes" present on the page
* Flip the switch on filter card "Is Cancer Gene Census"
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Biotype          |miRNA                                |
* Collect case counts for the following filters for cohort "MF_M_ICGC"
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Biotype          |miRNA                                |
* Collect table "Genes" Item Count for comparison
* Verify "Genes Item Count" and "Biotype_miRNA_MF_M_ICGC Count" are "Equal"
