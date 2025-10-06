# Header - Links
Date Created    : 09/29/2025
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Header - Links
Test-case       : PEAR-2518

tags: gdc-data-portal-v2, regression, header, navigation

## Navigate to Home Page
* On GDC Data Portal V2 app

## Validate Navigation Links - different tab
* These links on the "Header" should take the user to correct page in a new tab
  |button_text                                |text_on_expected_page                                          |
  |-------------------------------------------|---------------------------------------------------------------|
  |Video Guides                               |In this GDC 2.0 Video Tutorial, obtain an overview of          |
  |Obtaining Access to Controlled Data        |In order to obtain access to controlled data available in the  |

## Validate Apps Links
* These Apps links should take the user to correct page in the same tab
  |button_text                                |text_on_expected_page                                          |
  |-------------------------------------------|---------------------------------------------------------------|
  |Website                                    |The GDC supports several cancer genome programs at the NCI     |
  |API                                        |The GDC Application Programming Interface (API)                |
  |Data Transfer Tool                         |The GDC Data Transfer Tool (DTT) provides                      |
  |Documentation                              |A place where researchers, data submitters and developers can  |
  |Data Submission Portal                     |The GDC Data Submission Portal is a web-based system           |
  |Publications                               |The GDC provides access to information and supplementary files from publications|
* Navigate to "Manage Sets" from "Header" "section"
* These Apps links should take the user to correct page in the same tab
  |button_text                                |text_on_expected_page                                          |
  |-------------------------------------------|---------------------------------------------------------------|
  |Data Portal                                |A repository and computational platform for cancer             |


## Validate Pop-up Modal
* Select link "Send Feedback" from the header section
* Is text "We are continuously working on improving GDC 2.0 and would greatly appreciate feedback from our users." present on the page
* Close the modal
