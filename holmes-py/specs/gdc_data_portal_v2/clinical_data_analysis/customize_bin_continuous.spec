# Clinical Data Analysis - Customize Bin Continuous
Date Created      : 08/28/2023
Version		      : 1.0
Owner		         : GDC QA
Description       : cDAVE continuous bin continuous values
Test-Case         : PEAR-610

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Navigate to Clinical Data Analysis
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Test Set Interval
* On the "Age At Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Is text "Create Custom Bins: Age At Diagnosis" present on the page
* Set interval of "5000" with values from "10" to less than "30010" in a continuous custom bin modal on the Clinical Data Analysis page
* "Save" the continuous custom bin modal on the Clinical Data Analysis page
* Validate the "Age At Diagnosis" analysis card's table contains these values
   |value                                   |
   |----------------------------------------|
   |10 to <5,010                            |
   |5,010 to <10,010                        |
   |10,010 to <15,010                       |
   |15,010 to <20,010                       |
   |20,010 to <25,010                       |
   |25,010 to <30,010                       |

## Test Custom Ranges
* On the "Age At Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Select bin option "Custom Interval" in a continuous custom bin modal on the Clinical Data Analysis page
* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 1     |12      |1000          |1          |
   |Custom Bin 2     |1000    |3000          |2          |
   |Custom Bin 3     |4000    |4500          |3          |
   |Custom Bin 4     |4501    |10000         |4          |
   |Custom Bin 5     |10000   |18000         |5          |

* "Save" the continuous custom bin modal on the Clinical Data Analysis page
* Validate the "Age At Diagnosis" analysis card's table contains these values
   |value                                   |
   |----------------------------------------|
   |Custom Bin 1                            |
   |Custom Bin 2                            |
   |Custom Bin 3                            |
   |Custom Bin 4                            |
   |Custom Bin 5                            |
* On the "Age At Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* "Edit" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Edited Name 2    |2000    |2999          |2          |
   |Edited Name 3    |4050    |4321          |3          |
   |Edited Name 4    |6000    |7500          |4          |
* Delete custom range bin in row number "1"
* "Save" the continuous custom bin modal on the Clinical Data Analysis page
* Validate the "Age At Diagnosis" analysis card's table contains these values
   |value                                   |
   |----------------------------------------|
   |Edited Name 2                           |
   |Edited Name 3                           |
   |Edited Name 4                           |
   |Custom Bin 5                            |
* Validate the "Age At Diagnosis" analysis card's table do not contain these values
   |value                                   |
   |----------------------------------------|
   |Custom Bin 1                            |
   |Custom Bin 2                            |
   |Custom Bin 3                            |
   |Custom Bin 4                            |
* On the "Age At Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Reset to Default"
