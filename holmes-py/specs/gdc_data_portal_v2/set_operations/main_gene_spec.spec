# Set Operations - Gene Set
Date Created    : 07/10/2024
Version	        : 1.0
Owner		    : GDC QA
Description		: Set Operations - Gene Set Main Page
Test-Case       : PEAR-1230

tags: gdc-data-portal-v2, set-operations, regression

## Navigate to Manage Sets
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Gene Sets
* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Main 1" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "B-Gene_Set_SO_Main_1" in Set Creation modal

* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Main 2" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "B-Gene_Set_SO_Main_2" in Set Creation modal

* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Main 3" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "B-Gene_Set_SO_Main_3" in Set Creation modal

## Navigate to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Select Genes - 2 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |B-Gene_Set_SO_Main_1     |
  |B-Gene_Set_SO_Main_2     |
* Run analysis on Set Operations
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S1 intersect S2              |
  |S1 minus S2                  |
  |S2 minus S1                  |
* Download "S1 intersect S2" from "Set Operations"
* Read from "S1 intersect S2 from Set Operations"
* Verify that "S1 intersect S2 from Set Operations" has expected information
  |required_info    |
  |-----------------|
  |ENSG00000121879  |
  |ENSG00000133703  |
  |ENSG00000141510  |
  |ENSG00000164796  |
  |ENSG00000165323  |
  |ENSG00000167548  |
  |ENSG00000168702  |
  |ENSG00000171862  |
  |ENSG00000181143  |
  |ENSG00000196159  |
* Verify that "S1 intersect S2 from Set Operations" does not contain specified information
  |required_info    |
  |-----------------|
  |ENSG00000005339  |
  |ENSG00000055609  |
  |ENSG00000083857  |
  |ENSG00000085224  |
  |ENSG00000117713  |
  |ENSG00000029534  |
  |ENSG00000040731  |
  |ENSG00000046889  |
  |ENSG00000066032  |
  |ENSG00000109670  |
  |ENSG00000115760  |
  |ENSG00000118058  |
* Select set "S2 minus S1" to save as a new set in the Set Operations analysis screen
* Name set "S2 minus S1 Set" in Save Set modal
write code here for union row
