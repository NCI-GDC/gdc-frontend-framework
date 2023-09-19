# Mutation Frequency - Saving a Cohort
Date Created   : 09/16/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Save a cohort with genes, mutations, and both filters
Test-Case      : PEAR-1510

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Add Genes to Cohort and Save
* Wait for loading spinner
* Select "Add" from the Cohort Bar
* Name the cohort "Gene Cohort" in the Cohort Bar section
* "Create" "Gene Cohort has been created" and "remove modal" in the Cohort Bar section
* Search the table for "TP53"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |TP53         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "ERBB4"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |ERBB4        |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Search the table for "FAM47C"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAM47C       |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Pause "3" seconds
* Select "Save" from the Cohort Bar
* "Save" "Cohort has been saved" and "remove modal" in the Cohort Bar section
* "Gene Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Gene               |TP53ERBB4FAM47C      |1                        |

## Add Mutations to Cohort and Save
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for table loading spinner
* Select "Add" from the Cohort Bar
* Name the cohort "Mutation Cohort" in the Cohort Bar section
* "Create" "Mutation Cohort has been created" and "remove modal" in the Cohort Bar section
* Search the table for "chr3:g.179218294G>A"
* Wait for table body text to appear
  |expected_text        |row  |column |
  |---------------------|-----|-------|
  |chr3:g.179218294G>A  |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Pause "3" seconds
* Select "Save" from the Cohort Bar
* "Save" "Cohort has been saved" and "remove modal" in the Cohort Bar section
* "Mutation Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections                           |position in filter area  |
  |-------------------|-------------------------------------|-------------------------|
  |SSM ID             |31df4cc1-3220-53c9-97a0-e926dd3f982b |1                        |

## Add Mutation and Gene to Cohort and Save
* Select "Add" from the Cohort Bar
* Name the cohort "Mutation and Gene Cohort" in the Cohort Bar section
* "Create" "Mutation and Gene Cohort has been created" and "remove modal" in the Cohort Bar section
* Search the table for "chr7:g.140753336A>T"
* Wait for table body text to appear
  |expected_text        |row  |column |
  |---------------------|-----|-------|
  |chr7:g.140753336A>T  |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Switch to "Genes" tab in the Mutation Frequency app
* Is text "Distribution of Most Frequently Mutated Genes" present on the page
* Wait for table loading spinner
* Search the table for "BRAF"
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |BRAF         |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Pause "3" seconds
* Select "Save" from the Cohort Bar
* "Save" "Cohort has been saved" and "remove modal" in the Cohort Bar section
* "Mutation and Gene Cohort" should be the active cohort
* Validate the cohort query filter area has these filters
  |facet_name         |selections                           |position in filter area  |
  |-------------------|-------------------------------------|-------------------------|
  |SSM ID             |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |1                        |
  |Gene               |BRAF                                 |2                        |
