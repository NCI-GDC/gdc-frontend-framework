# Clinical Data Analysis - Continuous Bin Negative Rule Check
Date Created      : 10/24/2023
Version		      : 1.0
Owner		         : GDC QA
Description       : cDAVE Negative Rule Checking for Continuous Bin
Test-Case         : PEAR-1584

tags: gdc-data-portal-v2, clinical-data-analysis, regression, negative-test, negative-custom-bin-test

## Navigate to Clinical Data Analysis
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Continuous Value Rule Check - Set Interval
* On the "Age At Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Is text "Create Custom Bins: Age At Diagnosis" present on the page

* Set interval of "" with values from "250" to less than "5000" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Required field" present on the page
* Verify the button "Custom Bins Save" is disabled
* Set interval of "100" with values from "" to less than "5000" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Required field" present on the page
* Verify the button "Custom Bins Save" is disabled
* Set interval of "100" with values from "250" to less than "" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Required field" present on the page
* Verify the button "Custom Bins Save" is disabled

* Set interval of "0" with values from "25" to less than "8" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Must be greater than 0" present on the page
* Is text "Must be less than 8" present on the page
* Is text "Must be greater than 25" present on the page
* Verify the button "Custom Bins Save" is disabled

* Set interval of "Not" with values from "Number" to less than "Input" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Not is not a valid number" present on the page
* Is text "Number is not a valid number" present on the page
* Is text "Input is not a valid number" present on the page
* Verify the button "Custom Bins Save" is disabled

* Set interval of "100" with values from "5" to less than "50" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Must be less than or equal to 45" present on the page
* Verify the button "Custom Bins Save" is disabled

* Set interval of "1000.123" with values from "500" to less than "25000" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Use up to 2 decimal places" present on the page
* Verify the button "Custom Bins Save" is disabled
* Set interval of "1000" with values from "500.123" to less than "25000" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Use up to 2 decimal places" present on the page
* Verify the button "Custom Bins Save" is disabled
* Set interval of "1000" with values from "500" to less than "25000.123" in a continuous custom bin modal on the Clinical Data Analysis page
* Is text "Use up to 2 decimal places" present on the page
* Verify the button "Custom Bins Save" is disabled

## Continuous Value Rule Check - Custom Ranges
* "Cancel" the continuous custom bin modal on the Clinical Data Analysis page
* On the "Age At Diagnosis" card, select "Customize Bins" button on the Clinical Data Analysis page
* Select "Edit Bins"
* Select bin option "Custom Interval" in a continuous custom bin modal on the Clinical Data Analysis page

* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 1     |10      |100           |1          |
   |Custom Bin 1     |1000    |3000          |2          |
* Is text "Bin names must be unique" present on the page
* Verify the button "Custom Bins Save" is disabled

* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 2     |10      |100           |2          |
* Verify the button "Custom Bins Save" is disabled

* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 2     |200     |1000          |2          |
* "Edit" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |                 |10      |100           |1          |
* Is text "Required field" present on the page
* Verify the button "Custom Bins Save" is disabled

* "Edit" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 1     |10      |100           |1          |
* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 3     |input1  |input2        |3          |
* Is text "input1 is not a valid number" present on the page
* Is text "input2 is not a valid number" present on the page
* Verify the button "Custom Bins Save" is disabled

* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 3     |5000    |4000          |3          |
* Is text "Must be less than 4000" present on the page
* Is text "Must be greater than 5000" present on the page
* Verify the button "Custom Bins Save" is disabled

* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 3     |5000.123|6000          |3          |
* Is text "Use up to 2 decimal places" present on the page
* Verify the button "Custom Bins Save" is disabled

* "Add" a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page
   |Bin Name         |From    |To Less Than  |Row Number |
   |-----------------|--------|--------------|-----------|
   |Custom Bin 3     |5000    |6000.123      |3          |
* Is text "Use up to 2 decimal places" present on the page
* Verify the button "Custom Bins Save" is disabled
* "Cancel" the continuous custom bin modal on the Clinical Data Analysis page
