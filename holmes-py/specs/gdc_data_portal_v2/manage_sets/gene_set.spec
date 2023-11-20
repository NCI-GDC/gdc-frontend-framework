# Manage Sets - Gene
Date Created   : 11/13/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Gene Set
Test-Case      : PEAR-1619

tags: gdc-data-portal-v2, manage-sets, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Gene Set
* Select Create Set and from the dropdown choose "Genes"
* Upload "Top Mutated Gene Set" "txt" from "Manage Sets" in "Manage Sets Import" through "Browse"
* Is text "10 submitted gene identifiers mapped to 10 unique GDC genes" present on the page
* Select "Submit"
* Enter text "Top Mutated Genes" in the "Input field for new set name" search bar
* Select "Save"
* Is text "Set has been saved." present on the page

## Edit Set Name
* Select "Edit Set Name" for set "Top Mutated Genes" on Manage Sets page
* Enter "Edited Name Gene Set" in the text box "Enter Set Name"
* Select button "Accept Set Name Input"

## Validate Item List
* Select item list for set "Edited Name Gene Set" on Manage Sets page
* Verify the table "Set Information" is displaying this information
    |text_in_table_to_check |
    |-----------------------|
    |ENSG00000121879        |
    |ENSG00000164796        |
    |ENSG00000196159        |
    |ENSG00000181143        |
    |ENSG00000168702        |
    |ENSG00000167548        |
    |ENSG00000133703        |
    |ENSG00000171862        |
    |ENSG00000141510        |
    |ENSG00000165323        |
* Close set panel
