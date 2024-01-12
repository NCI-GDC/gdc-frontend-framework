# Footer - Links
Date Created    : 06/12/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Footer - Links
Test-case       : PEAR-942

tags: gdc-data-portal-v2, regression, footer, navigation

## Navigate to Home Page
* On GDC Data Portal V2 app

## Check Footer Text
* Is text "at the National Institutes of Health" present on the page
* Is text "NIH... Turning Discovery Into Health" present on the page

## Validate Navigation Links - different tab
* These links on the "Footer" should take the user to correct page in a new tab
  |button_text                                |text_on_expected_page                                          |
  |-------------------------------------------|---------------------------------------------------------------|
  |Data Portal                                |A repository and computational platform for cancer researchers |
  |Website                                    |The NCI's Genomic Data Commons                                 |
  |API                                        |The GDC Application Programming Interface (API)                |
  |Data Transfer Tool                         |The GDC Data Transfer Tool, a command-line driven application  |
  |Documentation                              |can find detailed information on GDC processes and tools       |
  |Data Submission Portal                     |The GDC Data Submission Portal is a web-based system           |
  |Publications                               |To request a publication page that meets the above criteria    |
  |Support                                    |please contact the GDC Help Desk                               |
  |Listserv                                   |This screen allows you to subscribe or unsubscribe to the      |
  |Accessibility                              |Section 508 requires that all individuals with disabilities    |
  |Disclaimer                                 |NCI urges users to consult with a qualified physician          |
  |FOIA                                       |provides individuals with a right to access to records         |
  |HHS Vulnerability Disclosure               |If you make a good faith effort to comply with this policy     |
  |U.S. Department of Health and Human Services|Receive the latest updates from the Secretary, Blogs,         |
  |National Institutes of Health              |National Institutes of Health, 9000 Rockville Pike, Bethesda,  |
  |National Cancer Institute                  |National Cancer Institute                                      |
  |USA.gov                                    |USA.gov helps you locate a                                     |

## Validate Navigation Links - same tab
* These links should take the user to correct page in the same tab
  |button_text                    |expected_landing_page|
  |-------------------------------|---------------------|
  |Site Home                      |Home                 |
