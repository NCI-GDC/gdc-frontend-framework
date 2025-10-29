# Clinical Data Analysis - Categorical Bin Negative Rule Check
Date Created      : 10/24/2023
Version		      : 1.0
Owner		         : GDC QA
Description       : cDAVE Negative Rule Checking for Categorical Bin
Test-Case         : PEAR-1584

tags: gdc-data-portal-v2, clinical-data-analysis, regression, negative-test, negative-custom-bin-test

## Navigate to Clinical Data Analysis
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Categorical Value Rule Check
* On the "Gender" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Is text "Create Custom Bins: Gender" present on the page
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |male                                    |
   |missing                                  |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "female" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "The group name cannot be the same as the name of a value" present on the page
* Name the group of values "" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "Required field" present on the page
* Name the group of values "unknown" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "\"unknown\" already exists" present on the page
* Name the group of values "Group 1" in a categorical custom bin modal on the Clinical Data Analysis page
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |not reported                            |
   |unknown                                 |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "Group 1" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "\"Group 1\" already exists" present on the page
* Close the modal
