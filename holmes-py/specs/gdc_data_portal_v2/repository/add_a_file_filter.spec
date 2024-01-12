# Download Center - Repository filters
Date Created    : 12/15/2022
Version			: 1.0
Owner		    : GDC QA
Description		: Test Repository Filters

tags: gdc-data-portal-v2, repository, repository_filters, smoke-test

## Repository Filters

tags: regression, smoke

* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Filters on Repository
* Verify that the "Filters" text is displayed on "Repository" "app"

## Default filters on Repository
* Verify that the following default filters are displayed in order
   |default_filters      |
   |---------------------|
   |Experimental Strategy|
   |Wgs Coverage         |
   |Data Category        |
   |Data Type            |
   |Data Format          |
   |Workflow Type        |
   |Platform             |
   |Access               |

## Add a Custom Filter modal
* Navigate to "Add a File Filter" from "Repository" "app"

## Add a Custom Filter displayed on Add a Custom Filter modal
* Verify that the "Add a Custom Filter" text is displayed on "Add a Custom Filter" "modal"

## Search for a file property on Add a Custom Filter modal
* Verify that the "Search for a property" text is displayed on "Add a Custom Filter" "modal"

## File properties on Add a Custom Filter modal
* Verify that the "302 properties" text is displayed on "Add a Custom Filter" "modal"

## File counts listed on Add a Custom Filter modal
* Verify "302" items on Add a Custom Filter filter list

## File filter list does not start with 'files.' on Add a Custom Filter modal
* Verify file filter names do not start with "files."

## Only show properties with values on Add a Custom Filter modal
* Verify that the "Only show properties with values" text is displayed on "Add a Custom Filter" "modal"

## Close Modal
* Close the modal

## Search filters

   |filter_name                                           |nth|
   |------------------------------------------------------|---|
   |metadata_files.updated_datetime                       |1  |
   |analysis.analysis_id                                  |1  |
   |archive.file_size                                     |1  |
   |downstream_analyses.output_files.experimental_strategy|1  |

* Navigate to "Add a File Filter" from "Repository" "app"
* Search for file filter, <filter_name>
Verify that the <filter_name> text is displayed on "Add a Custom Filter" "modal"
* Select file filter, <filter_name>, nth: <nth>
* Verify that the file filter, <filter_name>, has been applied
