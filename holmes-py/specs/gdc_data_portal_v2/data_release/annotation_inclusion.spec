# Data Release - Annotation Inclusion
Date Created        : 08/04/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Annotation Inclusion in Data Release
Test-Case           : PEAR-1933

tags: gdc-data-portal-v2, data-release

table: resources/data_release/annotation_inclusion.csv

## Annotation Affected in this Data Release
* On GDC Data Portal V2 app
* Quick search for <Annotation UUID> and go to its page
* Verify the table "Summary Annotation Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Annotation UUID>                      |
    |<Entity UUID>                          |
    |<Case UUID>                            |
    |<Project>                              |
    |<Classification>                       |
    |<Category>                             |
    |<Created On>                           |
* Verify the table "Notes Annotation Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Notes>                                |
* Pause "1" seconds
