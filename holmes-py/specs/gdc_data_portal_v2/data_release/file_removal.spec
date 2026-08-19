# Data Release - File Removal
Date Created        : 07/17/2026
Version			    : 1.0
Owner		        : GDC QA
Description		    : When a File is Removed Entirely in a Data Release
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

table: resources/data_release/file_removal.csv

## File Excluded in this Data Release
* On GDC Data Portal V2 app
* Quick search for <Removed File UUID>
* Pause "2" seconds
* Is text "No results found" present on the page
