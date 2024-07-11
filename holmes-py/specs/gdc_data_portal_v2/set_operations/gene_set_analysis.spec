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

## Genes - 2 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |B-Gene_Set_SO_Main_1     |
  |B-Gene_Set_SO_Main_2     |
* Run analysis on Set Operations
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
* Name set "B-S2 minus S1 Gene Set" in Save Set modal

## Genes Union Row - 2 Sets
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S1 intersect S2              |
  |S1 minus S2                  |
  |S2 minus S1                  |
* Download "File" from "Set Operations Union Row"
* Read from "File from Set Operations Union Row"
* Verify that "File from Set Operations Union Row" has expected information
  |required_info    |
  |-----------------|
  |ENSG00000005339  |
  |ENSG00000029534  |
  |ENSG00000040731  |
  |ENSG00000046889  |
  |ENSG00000055609  |
  |ENSG00000066032  |
  |ENSG00000083857  |
  |ENSG00000085224  |
  |ENSG00000109670  |
  |ENSG00000115760  |
  |ENSG00000117713  |
  |ENSG00000118058  |
  |ENSG00000121879  |
  |ENSG00000133703  |
  |ENSG00000134982  |
  |ENSG00000140836  |
  |ENSG00000141510  |
  |ENSG00000147724  |
  |ENSG00000148400  |
  |ENSG00000149311  |
  |ENSG00000157764  |
  |ENSG00000164796  |
  |ENSG00000165323  |
  |ENSG00000167548  |
  |ENSG00000168702  |
  |ENSG00000169862  |
  |ENSG00000171862  |
  |ENSG00000172915  |
  |ENSG00000173821  |
  |ENSG00000174469  |
  |ENSG00000178568  |
  |ENSG00000181143  |
  |ENSG00000183454  |
  |ENSG00000185008  |
  |ENSG00000187323  |
  |ENSG00000196090  |
  |ENSG00000196159  |
  |ENSG00000196367  |
  |ENSG00000196712  |
  |ENSG00000213281  |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name set "B-S1 and S2 Union Gene Set" in Save Set modal

## Validate Set Creation and Counts - 2 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                 |
  |-------------------------|
  |S2 minus S1              |
* Collect union row save set item count as "S1 Union S2" on the Set Operations analysis screen
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table to "100"
* Collect these set item counts on Manage Sets page
  |set_name                   |
  |---------------------------|
  |B-S2 minus S1 Gene Set     |
  |B-S1 and S2 Union Gene Set |
* Verify "S2 minus S1 Count Set Operations" and "B-S2 minus S1 Gene Set Count Manage Sets" are "Equal"
* Verify "S1 Union S2 Count Set Operations" and "B-S1 and S2 Union Gene Set Count Manage Sets" are "Equal"

## Navigate Back to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Genes - 3 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |B-Gene_Set_SO_Main_1     |
  |B-Gene_Set_SO_Main_2     |
  |B-Gene_Set_SO_Main_3     |
* Run analysis on Set Operations
* Download "S1 intersect S2 intersect S3" from "Set Operations"
* Read from "S1 intersect S2 intersect S3 from Set Operations"
* Verify that "S1 intersect S2 intersect S3 from Set Operations" has expected information
  |required_info    |
  |-----------------|
  |ENSG00000133703  |
  |ENSG00000141510  |
  |ENSG00000164796  |
  |ENSG00000168702  |
  |ENSG00000181143  |
* Verify that "S1 intersect S2 from Set Operations" does not contain specified information
  |required_info    |
  |-----------------|
  |ENSG00000047936  |
  |ENSG00000198173  |
  |ENSG00000029534  |
  |ENSG00000196367  |
  |ENSG00000083857  |
  |ENSG00000040731  |
* Select set "S3 minus S1 union S2" to save as a new set in the Set Operations analysis screen
* Name set "B-S3 minus S1 union S2 Gene Set" in Save Set modal

## Genes Union Row - 3 Sets
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S1 intersect S2 intersect S3 |
  |S1 intersect S2 minus S3     |
  |S2 intersect S3 minus S1     |
  |S1 intersect S3 minus S2     |
  |S1 minus S2 union S3         |
  |S2 minus S1 union S3         |
  |S3 minus S1 union S2         |
* Download "File" from "Set Operations Union Row"
* Read from "File from Set Operations Union Row"
* Verify that "File from Set Operations Union Row" has expected information
  |required_info    |
  |-----------------|
  |ENSG00000005339  |
  |ENSG00000029534  |
  |ENSG00000040731  |
  |ENSG00000046889  |
  |ENSG00000047936  |
  |ENSG00000055609  |
  |ENSG00000065526  |
  |ENSG00000066032  |
  |ENSG00000083857  |
  |ENSG00000085224  |
  |ENSG00000109670  |
  |ENSG00000115760  |
  |ENSG00000117713  |
  |ENSG00000118058  |
  |ENSG00000121879  |
  |ENSG00000127329  |
  |ENSG00000127616  |
  |ENSG00000133703  |
  |ENSG00000134982  |
  |ENSG00000138413  |
  |ENSG00000139687  |
  |ENSG00000140836  |
  |ENSG00000141510  |
  |ENSG00000145113  |
  |ENSG00000145675  |
  |ENSG00000146648  |
  |ENSG00000147724  |
  |ENSG00000147889  |
  |ENSG00000148400  |
  |ENSG00000149311  |
  |ENSG00000157764  |
  |ENSG00000163939  |
  |ENSG00000164796  |
  |ENSG00000165323  |
  |ENSG00000167548  |
  |ENSG00000168542  |
  |ENSG00000168702  |
  |ENSG00000169862  |
  |ENSG00000171862  |
  |ENSG00000172915  |
  |ENSG00000173821  |
  |ENSG00000174469  |
  |ENSG00000178568  |
  |ENSG00000181143  |
  |ENSG00000181555  |
  |ENSG00000183454  |
  |ENSG00000185008  |
  |ENSG00000187323  |
  |ENSG00000196090  |
  |ENSG00000196159  |
  |ENSG00000196367  |
  |ENSG00000196712  |
  |ENSG00000196924  |
  |ENSG00000198173  |
  |ENSG00000213281  |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name set "B-S1 S2 S3 Union Gene Set" in Save Set modal

## Validate Set Creation and Counts - 3 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                 |
  |-------------------------|
  |S3 minus S1 union S2     |
* Collect union row save set item count as "S1 Union S2 Union S3 Gene Set" on the Set Operations analysis screen
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table to "100"
* Collect these set item counts on Manage Sets page
  |set_name                       |
  |-------------------------------|
  |B-S3 minus S1 union S2 Gene Set|
  |B-S1 S2 S3 Union Gene Set      |
* Verify "S3 minus S1 union S2 Count Set Operations" and "B-S3 minus S1 union S2 Gene Set Count Manage Sets" are "Equal"
* Verify "S1 Union S2 Union S3 Gene Set Count Set Operations" and "B-S1 S2 S3 Union Gene Set Count Manage Sets" are "Equal"
