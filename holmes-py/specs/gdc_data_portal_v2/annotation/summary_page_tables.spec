# Annotation Summary Page - Validate Tables
Date Created        : 05/12/2025
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Tables in Annotation Summary Page
Test-Case           : PEAR-2419

tags: gdc-data-portal-v2, regression, annotations

## Navigate to Summary Page: 00e91bc8-2882-41b1-93de-938f71259e91
* On GDC Data Portal V2 app
* Quick search for "00e91bc8-2882-41b1-93de-938f71259e91" and go to its page

## Summary Table - Left
* Verify the vertical table "Left Summary Annotation Summary" header text is correct
    |expected_text                          |row  |
    |---------------------------------------|-----|
    |Annotation UUID                        |1    |
    |Entity UUID                            |2    |
    |Entity ID                              |3    |
    |Entity Type                            |4    |
    |Case UUID                              |5    |
    |Case ID                                |6    |
* Verify the table "Left Summary Annotation Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |00e91bc8-2882-41b1-93de-938f71259e91   |1    |2      |
    |df84fd65-d089-4876-a3a7-d85c74f6f351   |2    |2      |
    |e7355348-ddfd-4604-a6ae-d9139024b9cb   |3    |2      |
    |aligned_reads                          |4    |2      |
    |7dcc3723-aed6-4d2f-ad8b-afa443634139   |5    |2      |
    |BLGSP-71-06-00078                      |6    |2      |

## Summary Table - Right
* Verify the vertical table "Right Summary Annotation Summary" header text is correct
    |expected_text                          |row  |
    |---------------------------------------|-----|
    |Project                                |1    |
    |Classification                         |2    |
    |Category                               |3    |
    |Created On                             |4    |
    |Status                                 |5    |
* Verify the table "Right Summary Annotation Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |CGCI-BLGSP                             |1    |2      |
    |Notification                           |2    |2      |
    |General                                |3    |2      |
    |2023-08-02T12:12:14.393116-05:00       |4    |2      |
    |Approved                               |5    |2      |

## Notes
* Verify the table "Notes Annotation Summary" is displaying this information
    |text_to_validate                                                                                                   |
    |-------------------------------------------------------------------------------------------------------------------|
    |The contamination estimate provided by GATK was greater than 0.04. No variant calls will be released for this BAM. |


## Link Checking
* Select the link "Entity Annotation Summary"
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |df84fd65-d089-4876-a3a7-d85c74f6f351   |

* Quick search for "00e91bc8-2882-41b1-93de-938f71259e91" and go to its page

* Select the link "Case Annotation Summary"
* Verify the table "Summary Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |7dcc3723-aed6-4d2f-ad8b-afa443634139   |

* Quick search for "00e91bc8-2882-41b1-93de-938f71259e91" and go to its page

* Select the link "Project Annotation Summary"
* Verify the table "Summary Project Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |CGCI-BLGSP                             |
