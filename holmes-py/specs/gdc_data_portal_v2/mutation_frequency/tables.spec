# Mutation Frequency - Tables
Date Created   : 06/21/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Validate Table Details
Test-Case      : PEAR-899, PEAR-905

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Validate Gene Table Headers Text
* Wait for loading spinner
* Verify the table header text is correct
  |expected_text                        |column |
  |-------------------------------------|-------|
  |Cohort                               |2      |
  |Survival                             |3      |
  |Symbol                               |4      |
  |Name                                 |5      |
  |# SSM Affected Cases in Cohort       |6      |
  |# SSM Affected Cases Across the GDC  |7      |
  |# CNV Gain                           |8      |
  |# CNV Loss                           |9      |
  |# Mutations                          |10     |
  |Annotations                          |11     |
* Select or deselect these options from the table column selector
  |table_column_to_select               |
  |-------------------------------------|
  |Gene ID                              |
  |Cytoband                             |
  |Type                                 |
  |Annotations                          |
* Verify the table header text is correct
  |expected_text                        |column |
  |-------------------------------------|-------|
  |Gene ID                              |4      |
  |Cytoband                             |7      |
  |Type                                 |8      |

## Validate Mutation Table Headers Text
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for table loading spinner
* Verify the table header text is correct
  |expected_text                        |column |
  |-------------------------------------|-------|
  |Cohort                               |2      |
  |Survival                             |3      |
  |DNA Change                           |4      |
  |Protein Change                       |5      |
  |Type                                 |6      |
  |Consequences                         |7      |
  |# Affected Cases in Cohort           |8      |
  |# Affected Cases Across the GDC      |9      |
  |Impact                               |10     |
* Select or deselect these options from the table column selector
  |table_column_to_select               |
  |-------------------------------------|
  |Mutation ID                          |
* Verify the table header text is correct
  |expected_text                        |column |
  |-------------------------------------|-------|
  |Mutation ID                          |4      |
