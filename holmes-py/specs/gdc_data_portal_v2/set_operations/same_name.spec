# Set Operations - Selection with Same Name
Date Created    : 07/09/2025
Version	        : 1.0
Owner		        : GDC QA
Description		  : Selecting different sets and cohorts with the same name
Test-Case       : PEAR-1231

tags: gdc-data-portal-v2, set-operations, regression

## Navigate to Manage Sets
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Gene Sets for Selection Screen
* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Same Name" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Same_Name_1" in Set Creation modal

* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Same Name" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Same_Name_2" in Set Creation modal

## Create Mutation Sets for Selection Screen
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Same Name" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Same_Name_1" in Set Creation modal

* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Same Name" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Same_Name_2" in Set Creation modal

## Create Cohorts for Selection Screen
* Navigate to "Cohort" from "Header" "section"
* Create and save cohorts with randomly assigned filters
  |cohort_name              |number_of_filters|
  |-------------------------|-----------------|
  |A-Same_Name_1            |1                |
* Create and save cohorts with randomly assigned filters
  |cohort_name              |number_of_filters|
  |-------------------------|-----------------|
  |A-Same_Name_2            |1                |

## Navigate to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Gene Set Selection Logic
* Verify the button "Run Set Operations" is disabled
* Select the following checkboxes in the Set Operations analysis screen by name and type
  |checkbox_name            |type           |
  |-------------------------|---------------|
  |A-Same_Name_1            |Genes          |
  |A-Same_Name_2            |Genes          |
* Verify the button "Run Set Operations" is enabled
* Checkbox "A-Same_Name_1" with entity type "Mutations" should be disabled in the Set Operations app
* Checkbox "A-Same_Name_1" with entity type "Cohort" should be disabled in the Set Operations app
* Select the following checkboxes in the Set Operations analysis screen by name and type
  |checkbox_name            |type           |
  |-------------------------|---------------|
  |A-Same_Name_1            |Genes          |
  |A-Same_Name_2            |Genes          |

## Mutation Set Selection Logic
* Verify the button "Run Set Operations" is disabled
* Select the following checkboxes in the Set Operations analysis screen by name and type
  |checkbox_name            |type           |
  |-------------------------|---------------|
  |A-Same_Name_1            |Mutations      |
  |A-Same_Name_2            |Mutations      |
* Verify the button "Run Set Operations" is enabled
* Checkbox "A-Same_Name_1" with entity type "Genes" should be disabled in the Set Operations app
* Checkbox "A-Same_Name_1" with entity type "Cohort" should be disabled in the Set Operations app
* Select the following checkboxes in the Set Operations analysis screen by name and type
  |checkbox_name            |type           |
  |-------------------------|---------------|
  |A-Same_Name_1            |Mutations      |
  |A-Same_Name_2            |Mutations      |

## Cohort Selection Logic
* Verify the button "Run Set Operations" is disabled
* Select the following checkboxes in the Set Operations analysis screen by name and type
  |checkbox_name            |type           |
  |-------------------------|---------------|
  |A-Same_Name_1            |Cohort         |
  |A-Same_Name_2            |Cohort         |
* Verify the button "Run Set Operations" is enabled
* Checkbox "A-Same_Name_1" with entity type "Genes" should be disabled in the Set Operations app
* Checkbox "A-Same_Name_1" with entity type "Mutations" should be disabled in the Set Operations app
* Select the following checkboxes in the Set Operations analysis screen by name and type
  |checkbox_name            |type           |
  |-------------------------|---------------|
  |A-Same_Name_1            |Cohort         |
  |A-Same_Name_2            |Cohort         |
