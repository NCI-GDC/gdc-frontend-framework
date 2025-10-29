# Set Operations - Selection Screen
Date Created    : 07/08/2024
Version	        : 1.0
Owner		        : GDC QA
Description		  : Set Operations - Selection Screen
Test-Case       : PEAR-1231

tags: gdc-data-portal-v2, set-operations, regression

## Navigate to Manage Sets
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Gene Sets for Selection Screen
* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Selection Screen 1" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Gene_Set_SO_SS_1" in Set Creation modal

* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Selection Screen 2" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Gene_Set_SO_SS_2" in Set Creation modal

* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Selection Screen 3" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Gene_Set_SO_SS_3" in Set Creation modal

* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Selection Screen 4" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Gene_Set_SO_SS_4" in Set Creation modal

## Create Mutation Sets for Selection Screen
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Selection Screen 1" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Mutation_Set_SO_SS_1" in Set Creation modal

* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Selection Screen 2" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Mutation_Set_SO_SS_2" in Set Creation modal

* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Selection Screen 3" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Mutation_Set_SO_SS_3" in Set Creation modal

* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Selection Screen 4" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "A-Mutation_Set_SO_SS_4" in Set Creation modal

## Create Cohorts for Selection Screen
* Navigate to "Cohort" from "Header" "section"
* Create and save cohorts with randomly assigned filters
  |cohort_name              |number_of_filters|
  |-------------------------|-----------------|
  |A-Cohort_SO_SS_1         |2                |
* Collect "A-Cohort_SO_SS_1" Case Count for comparison
* Create and save cohorts with randomly assigned filters
  |cohort_name              |number_of_filters|
  |-------------------------|-----------------|
  |A-Cohort_SO_SS_2         |2                |
* Collect "A-Cohort_SO_SS_2" Case Count for comparison
* Create and save cohorts with randomly assigned filters
  |cohort_name              |number_of_filters|
  |-------------------------|-----------------|
  |A-Cohort_SO_SS_3         |2                |
* Collect "A-Cohort_SO_SS_3" Case Count for comparison
* Create and save cohorts with randomly assigned filters
  |cohort_name              |number_of_filters|
  |-------------------------|-----------------|
  |A-Cohort_SO_SS_4         |2                |
* Collect "A-Cohort_SO_SS_4" Case Count for comparison

## Navigate to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Gene Set Selection Logic
* Verify the button "Run Set Operations" is disabled
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Gene_Set_SO_SS_1       |
* Checkbox "A-Cohort_SO_SS_1" should be disabled in the Set Operations app
* Checkbox "A-Mutation_Set_SO_SS_1" should be disabled in the Set Operations app
* Checkbox "A-Gene_Set_SO_SS_4" should be enabled in the Set Operations app
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Gene_Set_SO_SS_2       |
  |A-Gene_Set_SO_SS_3       |
* Verify the button "Run Set Operations" is enabled
* Checkbox "A-Gene_Set_SO_SS_4" should be disabled in the Set Operations app
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Gene_Set_SO_SS_1       |
  |A-Gene_Set_SO_SS_2       |
  |A-Gene_Set_SO_SS_3       |

## Mutation Set Selection Logic
* Verify the button "Run Set Operations" is disabled
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Mutation_Set_SO_SS_1   |
* Checkbox "A-Cohort_SO_SS_1" should be disabled in the Set Operations app
* Checkbox "A-Gene_Set_SO_SS_1" should be disabled in the Set Operations app
* Checkbox "A-Mutation_Set_SO_SS_4" should be enabled in the Set Operations app
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Mutation_Set_SO_SS_2   |
  |A-Mutation_Set_SO_SS_3   |
* Verify the button "Run Set Operations" is enabled
* Checkbox "A-Mutation_Set_SO_SS_4" should be disabled in the Set Operations app
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Mutation_Set_SO_SS_1   |
  |A-Mutation_Set_SO_SS_2   |
  |A-Mutation_Set_SO_SS_3   |

## Cohort Set Selection Logic
* Verify the button "Run Set Operations" is disabled
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Cohort_SO_SS_1         |
* Checkbox "A-Mutation_Set_SO_SS_1" should be disabled in the Set Operations app
* Checkbox "A-Gene_Set_SO_SS_1" should be disabled in the Set Operations app
* Checkbox "A-Cohort_SO_SS_4" should be enabled in the Set Operations app
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Cohort_SO_SS_2         |
  |A-Cohort_SO_SS_3         |
* Verify the button "Run Set Operations" is enabled
* Checkbox "A-Cohort_SO_SS_4" should be disabled in the Set Operations app
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |A-Cohort_SO_SS_1         |
  |A-Cohort_SO_SS_2         |
  |A-Cohort_SO_SS_3         |

## Validate Item Counts
* Validate these item counts are correct in the Set Operations selection screen
  |set_name                 |expected_item_count|
  |-------------------------|-------------------|
  |A-Gene_Set_SO_SS_1       |5                  |
  |A-Gene_Set_SO_SS_2       |10                 |
  |A-Gene_Set_SO_SS_3       |15                 |
  |A-Gene_Set_SO_SS_4       |20                 |
  |A-Mutation_Set_SO_SS_1   |4                  |
  |A-Mutation_Set_SO_SS_2   |8                  |
  |A-Mutation_Set_SO_SS_3   |12                 |
  |A-Mutation_Set_SO_SS_4   |16                 |
* Collect these set item counts on the Set Operations selection screen
  |set_name                 |
  |-------------------------|
  |A-Cohort_SO_SS_1         |
  |A-Cohort_SO_SS_2         |
  |A-Cohort_SO_SS_3         |
  |A-Cohort_SO_SS_4         |
* Verify "A-Cohort_SO_SS_1 Case Count" and "A-Cohort_SO_SS_1 Count Set Operations" are "equal"
* Verify "A-Cohort_SO_SS_2 Case Count" and "A-Cohort_SO_SS_2 Count Set Operations" are "equal"
* Verify "A-Cohort_SO_SS_3 Case Count" and "A-Cohort_SO_SS_3 Count Set Operations" are "equal"
* Verify "A-Cohort_SO_SS_4 Case Count" and "A-Cohort_SO_SS_4 Count Set Operations" are "equal"

## Test Cancel Button
* Select "Cancel"
* Is text "Core Tools" present on the page

## Test Links on Selection Screen
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Select the link "Manage Sets"
* Is text "Manage your saved sets" present on the page

* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Select the link "Mutation Frequency"
* Is text "Distribution of Most Frequently Mutated Genes" present on the page

## Verify Text on Selection Screen
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"

* Is text "Select 2 or 3 of the same set type" present on the page
* Is text "Display a Venn diagram and compare/contrast your cohorts or sets of the same type." present on the page
* Is text "Select 2 or 3 of the same set type" present on the page
* Is text "Create cohorts in the Analysis Center. Create gene/mutation sets in Manage Sets or in analysis tools (e.g. Mutation Frequency)." present on the page
