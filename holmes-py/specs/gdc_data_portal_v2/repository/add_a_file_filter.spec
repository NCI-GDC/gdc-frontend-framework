# Download Center - Repository filters
Date Created    : 12/15/2022
Version			: 1.0
Owner		    : GDC QA
Description		: Test Repository Filters

tags: gdc-data-portal-v2, repository, repository_filters

## Repository Filters

tags: regression, smoke

* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Repository" from "Analysis" "app"

## Filters on Repository
* Verify that the "Filters" text is displayed on "Repository" "app"

## Default filters on Repository
* Verify that the following default filters are displayed in order

   |default_filters      |
   |---------------------|
   |Data Category        |
   |Data Type            |
   |Experimental Strategy|
   |Workflow Type        |
   |Data Format          |
   |Platform             |
   |Access               |


## Search filters

   |filter_name                                           |nth|
   |------------------------------------------------------|---|
   |metadata_files.updated_datetime                       |1  |
   |analysis.analysis_id                                  |1  |
   |archive.file_size                                     |1  |
   |downstream_analyses.output_files.experimental_strategy|1  |

* Navigate to "Add a File Filter" from "Repository" "app"
* Search for file filter, <filter_name>
* Verify that the <filter_name> text is displayed on "Add a File Filter" "modal"
* Select file filter, <filter_name>, nth: <nth>
* Verify that the file filter, <filter_name>, has been applied
