# Browse Annotation - Main Table
Date Created        : 05/13/2025
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Main Table in Browse Annotations
Test-Case           : PEAR-2420

tags: gdc-data-portal-v2, regression, annotations

## Navigate to Browse Annotations
* On GDC Data Portal V2 app
* Navigate to "Browse Annotations" from "Header" "section"

## Table Headers
* Verify the table "Annotations" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |UUID                                   |1      |
    |Case ID                                |2      |
    |Project                                |3      |
    |Entity Type                            |4      |
    |Entity ID                              |5      |
    |Category                               |6      |
    |Classification                         |7      |
    |Created Datetime                       |8      |

* In table "Annotations" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |Case ID                                |
    |Program Name                           |
    |Entity ID                              |
    |Status                                 |
    |Notes                                  |

* Verify the table "Annotations" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Case UUID                              |2      |
    |Program                                |4      |
    |Entity UUID                            |7      |
    |Status                                 |12     |
    |Notes                                  |13     |

## Table Body Text
* In table "Annotations", search the table for "aa3127f7-b51c-5969-b081-935d6f1a834b"
* Wait for table "Annotations" body text to appear
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |aa3127f7-b51c-5969-b081-935d6f1a834b   |1    |1      |
* Verify the table "Annotations" has a total of "1" items
* Verify the page is showing "Showing 1 - 1 of 1 annotation"
* Verify the table "Annotations" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |08269082-cd8d-413a-a606-aa140cccc9e6   |1    |2      |
    |TCGA-B3-A6W5                           |1    |3      |
    |TCGA                                   |1    |4      |
    |TCGA-KIRP                              |1    |5      |
    |analyte                                |1    |6      |
    |c429796a-d9f2-4ded-9876-21d6522f0f4f   |1    |7      |
    |TCGA-B3-A6W5-10A-01D                   |1    |8      |
    |General                                |1    |9      |
    |Observation                            |1    |10      |
    |2013-11-19T00:00:00	                |1    |11     |
    |Approved                               |1    |12     |
    |DNA analyte UUID: C429796A-D9F2-4DED-9876-21D6522F0F4F was involved in an extraction protocol deviation wherein isopropanol precipitation was used as a means of buffer exchange on the column-eluted analyte.|1    |13     |


## Table Links
* Select value from table "Annotations" by row and column
    |row   |column|
    |------|------|
    |1     |1     |
* Verify the table "Left Summary Annotation Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |aa3127f7-b51c-5969-b081-935d6f1a834b   |1    |2      |

* Navigate to "Browse Annotations" from "Header" "section"
* In table "Annotations", search the table for "MATCH-Q-B4LA"
* Select value from table "Annotations" by row and column
    |row   |column|
    |------|------|
    |1     |2     |
* Verify the table "Summary Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |MATCH-Q-B4LA                           |
    |d0bd08c1-67b0-4f84-893b-e14106d97503   |

* Navigate to "Browse Annotations" from "Header" "section"
* In table "Annotations", search the table for "MMRF-COMMPASS"
* Select value from table "Annotations" by row and column
    |row   |column|
    |------|------|
    |1     |3     |
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |MMRF-COMMPASS                          |
    |phs000748                              |

## Search Options for Table
* Navigate to "Browse Annotations" from "Header" "section"
* In table "Annotations" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |Case ID                                |
    |Entity ID                              |

* In table "Annotations", search the table for "17baafdc-bb59-429c-aad6-9298e862f410"
* Verify the table "Annotations" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |17baafdc-bb59-429c-aad6-9298e862f410   |1    |2      |

* In table "Annotations", search the table for "e49073ff-5da9-42c4-8276-c792e6f7b8b7"
* Verify the table "Annotations" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |e49073ff-5da9-42c4-8276-c792e6f7b8b7   |1    |6      |

* In table "Annotations", search the table for "TCGA-CV-7104-01A-13-2074-20"
* Verify the table "Annotations" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |TCGA-CV-7104-01A-13-2074-20            |1    |7      |
