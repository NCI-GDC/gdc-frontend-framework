# Cohort Builder - Search Bar Testing
Date Created    : 02/17/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - Searching
Test-case       : PEAR-797

tags: gdc-data-portal-v2, cohort-builder, search-bar

## Navigate to Cohort Builder

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - Search Bar

* Enter "Best Overall Response" in the text box "Cohort Builder Search Bar"

* Expected result "Best Overall Response" in the search bar on the Cohort Builder page

* Select search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |Best Overall Response  |Best Overall Response  |

* Enter "expressed in number" in the text box "Cohort Builder Search Bar"

* Expected result "Age at Diagnosis" in the search bar on the Cohort Builder page

* Select search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |Age at Diagnosis       |Age at Diagnosis       |

* Enter "MMRF-COMMPASS" in the text box "Cohort Builder Search Bar"

* Expected result "Project" in the search bar on the Cohort Builder page

* Select search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |Project                |Project                |

* Enter "age at index" in the text box "Cohort Builder Search Bar"

* Expected result "cohort-builder-search-no-results" in the search bar on the Cohort Builder page

* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
  |filter_name              |
  |-------------------------|
  |demographic.age_at_index |

Age at index is not in system after adding it, so we navigate away
and come back so it loads in and becomes searchable. This is only
with automation, performing it manually works as expected.
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort" from "Header" "section"

* Enter "age at index" in the text box "Cohort Builder Search Bar"

* Expected result "age at index" in the search bar on the Cohort Builder page

* Select search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |age at index           |Age at Index           |

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Age at Index     |Remove the facet     |
