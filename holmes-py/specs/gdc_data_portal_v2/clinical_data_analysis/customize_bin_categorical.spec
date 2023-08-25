# Clinical Data Analysis - Customize Bin Categorical
Date Created    : 08/25/2023
Version		      : 1.0
Owner		        : GDC QA
Description     : cDAVE customize bin categorical values
Test-Case       : PEAR-610

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Navigate to Clinical Data Analysis
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Test Values and Hidden Values
* On the "Race" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Is text "Create Custom Bins: Race" present on the page
* Validate values are "present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |white                                   |
   |not reported                            |
   |black or african american               |
   |unknown                                 |
   |asian                                   |
   |not allowed to collect                  |
   |other                                   |
   |missing                                 |
   |american indian or alaska native        |
   |native hawaiian or other pacific islander|
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |black or african american               |
   |unknown                                 |
   |missing                                 |
* Select "Hide Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Validate hidden values are "present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |black or african american               |
   |unknown                                 |
   |missing                                 |
* Validate values are "not present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |black or african american               |
   |unknown                                 |
   |missing                                 |
* Select the following hidden values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |unknown                                 |
   |missing                                 |
* Select "Show Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Validate values are "present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |white                                   |
   |not reported                            |
   |unknown                                 |
   |asian                                   |
   |not allowed to collect                  |
   |other                                   |
   |missing                                 |
   |american indian or alaska native        |
   |native hawaiian or other pacific islander|
* Validate hidden values are "present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |black or african american               |
* Validate values are "not present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |black or african american               |
* Select "Reset Group" in a categorical custom bin modal on the Clinical Data Analysis page
* Validate values are "present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |white                                   |
   |not reported                            |
   |black or african american               |
   |unknown                                 |
   |asian                                   |
   |not allowed to collect                  |
   |other                                   |
   |missing                                 |
   |american indian or alaska native        |
   |native hawaiian or other pacific islander|

## Test Group and Ungroup Values
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |not reported                            |
   |asian                                   |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "Custom Bin Group 1" in a categorical custom bin modal on the Clinical Data Analysis page
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |Custom Bin Group 1                      |
   |missing                                 |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Validate values are "present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |Custom Bin Group 1                      |
* Select "Edit Group Name" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "Edited Group Name" in a categorical custom bin modal on the Clinical Data Analysis page
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |Edited Group Name                       |
* Select "Ungroup Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Validate values are "not present" in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |Custom Bin Group 1                      |
   |Edited Group Name                       |
* Select "Cancel" in a categorical custom bin modal on the Clinical Data Analysis page

## Test Saving a Group
* Validate the "Race" analysis card's table contains these values
   |value                                   |
   |----------------------------------------|
   |white                                   |
   |not reported                            |
   |black or african american               |
   |unknown                                 |
   |asian                                   |
   |not allowed to collect                  |
   |other                                   |
   |missing                                 |
   |american indian or alaska native        |
   |native hawaiian or other pacific islander|
* On the "Race" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |white                                   |
   |not allowed to collect                  |
* Select "Group Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Name the group of values "Custom Bin Group in Table" in a categorical custom bin modal on the Clinical Data Analysis page
* Select "Save" in a categorical custom bin modal on the Clinical Data Analysis page
* Validate the "Race" analysis card's table contains these values
   |value                                   |
   |----------------------------------------|
   |Custom Bin Group in Table               |
* On the "Race" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Select the following values in a categorical custom bin modal on the Clinical Data Analysis page
   |value                                   |
   |----------------------------------------|
   |Custom Bin Group in Table               |
* Select "Ungroup Values" in a categorical custom bin modal on the Clinical Data Analysis page
* Select "Save" in a categorical custom bin modal on the Clinical Data Analysis page
