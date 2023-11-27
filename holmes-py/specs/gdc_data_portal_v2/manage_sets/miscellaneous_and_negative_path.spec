# Manage Sets - Miscellaneous and Negative Paths
Date Created    : 11/14/2023
Version	        : 1.0
Owner		    : GDC QA
Description		: Negative Scenarios, Text, and Links Validation
Test-Case       : PEAR-1620

tags: gdc-data-portal-v2, manage-sets, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Attempt to Create Gene Set with Mutations Identifiers
* Select Create Set and from the dropdown choose "Genes"
* Upload "Most Frequent Mutations" "tsv" from "Manage Sets" in "Manage Sets Import" through "Browse"
* Is text "0 submitted gene identifiers mapped to 0 unique GDC genes" present on the page
* Select "Unmatched"
* Is text "20 submitted gene identifiers not recognized" present on the page
* Close the modal
* Select "Discard"

## Attempt to Create Mutations Set with Gene Identifiers
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Top Mutated Gene Set" "txt" from "Manage Sets" in "Manage Sets Import" through "Browse"
* Is text "0 submitted mutation identifiers mapped to 0 unique GDC mutations" present on the page
* Select "Unmatched"
* Is text "10 submitted mutation identifiers not recognized" present on the page
* Close the modal
* Select "Discard"

## Create Gene Set with CSV
* Select Create Set and from the dropdown choose "Genes"
* Upload "Gene Set" "csv" from "Manage Sets" in "Manage Sets Import" through "Browse"
* Is text "10 submitted gene identifiers mapped to 10 unique GDC genes" present on the page
* Select "Unmatched"
* Is text "0 submitted gene identifiers not recognized" present on the page
* Select "Submit"
* Enter text "Gene Set CSV" in the "Input field for new set name" search bar
* Select "Save"
* Is text "Set has been saved." present on the page

## Validate Buttons Are Disabled
* Verify the button "Export Selected Set" is disabled
* Verify the button "Delete Selected Set" is disabled

## Validate Buttons Are Enabled
* Select checkbox for set "Gene Set CSV" on Manage Sets page
* Verify the button "Export Selected Set" is enabled
* Verify the button "Delete Selected Set" is enabled

## Validate Message Text
* Validate the message "Warning Banner" displays the text "Please be aware that your custom sets are deleted during each new GDC data release. You can export and re-upload them on this page."
* Validate the message "Manage Sets Description" displays the text "Create gene and mutation sets using the Create Set button or from the Mutation Frequency app."

## Validate Mutation Frequency Link
* Select the link "Mutation Frequency"
* Is text "Distribution of Most Frequently Mutated Genes" present on the page
