# Download Center
Date Created    : 12/15/2022
Version			: 1.0
Owner		    : GDC QA
Description		: Test Repository Filters

tags: gdc-data-portal-v2, repository, repository_filters

## Repository Filters

tags: regression, smoke

* On GDC Data Portal V2 app
* Go to "Analysis" page
* Navigate to "Repository" from "Analysis" "page"

## Filters on Repository
* Verify that the "Filters" text is displayed on "Repository" "page"

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


## Add a File Filter modal
On GDC Data Portal V2 app
Go to "Analysis" page
Navigate to "Repository" from "Analysis" page
* Navigate to "Add a File Filter" from "Repository" "modal"

## Add a File Filter displayed on Add a File Filter modal
* Verify that the "Add a File Filter" text is displayed on "Add a File Filter" "modal"

## Search for a file property on Add a File Filter modal
* Verify that the "Search for a file property" text is displayed on "Add a File Filter" "modal"

## # file properties on Add a File Filter modal
* Verify that the "299 file properties" text is displayed on "Add a File Filter" "modal"

## # file counts listed on Add a File Filter modal
* Verify "299" items on Add a File Filter filter list

## File filter list does not start with 'files.' on Add a File Filter modal
* Verify file filter names do not start with "files."

## Only show properties with values on Add a File Filter modal
* Verify that the "Only show properties with values" text is displayed on "Add a File Filter" "modal"
* Close "Add a File Filter" modal

## Search filters

   |filter_name                                           |nth|
   |------------------------------------------------------|---|
   |metadata_files.updated_datetime                       |1  |
   |analysis.analysis_id                                  |1  |
   |archive.file_size                                     |1  |
   |downstream_analyses.output_files.experimental_strategy|1  |

* Navigate to "Add a File Filter" from "Repository" "modal"
* Search for file filter, <filter_name>
* Verify that the <filter_name> text is displayed on "Add a File Filter" "modal"
* Select file filter, <filter_name>, nth: <nth>
* Verify that the file filter, <filter_name>, has been applied
* Pause "5" seconds
