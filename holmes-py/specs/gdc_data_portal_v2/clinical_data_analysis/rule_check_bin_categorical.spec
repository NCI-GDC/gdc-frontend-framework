# Clinical Data Analysis - Categorical Bin Negative Rule Check
Date Created      : 10/24/2023
Version		      : 1.0
Owner		         : GDC QA
Description       : cDAVE Negative Rule Checking for Categorical Bin
Test-Case         : PEAR-1584

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Navigate to Clinical Data Analysis
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Categorical Value Rule Check
* On the "Primary Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Is text "Create Custom Bins: Primary Diagnosis" present on the page
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |adenocarcinoma, nos                     |
   |squamous cell carcinoma, nos            |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "adenocarcinoma, nos" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "The group name cannot be the same as the name of a value" present on the page
* Name the group of values "" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "Required field" present on the page
* Name the group of values "missing" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "\"missing\" already exists" present on the page
* Name the group of values "Group 1" in a categorical custom bin modal on the Clinical Data Analysis page
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |infiltrating ductular carcinoma         |
   |glioblastoma                            |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "Group 1" in a categorical custom bin modal on the Clinical Data Analysis page
* Is text "\"Group 1\" already exists" present on the page
* Close the modal
