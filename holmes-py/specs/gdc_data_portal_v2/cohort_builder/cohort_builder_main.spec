# Cohort Builder - General, Range, Date, String facet card testing
Date Created    : 02/10/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - card functions
Test-case       : PEAR-792

tags: gdc-data-portal-v2, cohort-builder, filter-card

## Navigate to Cohort Builder

tags: regression, smoke, cohort-builder

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - General Card Functions
tags: cohort-selections

* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8010/3               |

* Is checkbox checked
  |checkbox_id          |
  |---------------------|
  |8010/3               |

* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8010/3               |

* Is checkbox not checked
  |checkbox_id          |
  |---------------------|
  |8010/3               |

* Perform the following actions from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Morphology       |Sort numerically     |

* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8140/3              |

* Perform the following actions from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Morphology       |Sort alphabetically  |

* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |8000/0              |

* Perform the following actions from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Morphology       |Flip between form and chart  |
  |Morphology       |clear selection      |
  |Morphology       |Search               |
  |Morphology       |Flip between form and chart  |

* Enter text in a filter card from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |label               |text  |
  |-----------------|---------------------|------|
  |Morphology       |search values        |9950/3|

* Make the following selections from "General Diagnosis" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Morphology       |9950/3               |
  |Morphology       |9950/3               |

* Click the show more or show less button from "Available Data" tab on the Cohort Builder page
  |facet_name       |label               |
  |-----------------|---------------------|
  |Data Format      |plus-icon            |

* Make the following selections from "Available Data" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Data Format       |xlsx                |

* Click the show more or show less button from "Available Data" tab on the Cohort Builder page
  |facet_name       |label               |
  |-----------------|---------------------|
  |Data Format      |minus-icon           |

* Perform the following actions from "Available Data" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Data Format      |clear selection      |

## Cohort Builder - Range Card Functions

* Enter text in a filter card from "Demographic" tab on the Cohort Builder page
  |facet_name       |label                |text  |
  |-----------------|---------------------|------|
  |Age at Diagnosis |input from value     |59    |
  |Age at Diagnosis |input to value       |71    |

* Click the following objects from "Demographic" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Age at Diagnosis |Apply                |

* Click the following radio buttons
  |radio_id                                           |
  |---------------------------------------------------|
  |cases.diagnoses.age_at_diagnosis_21915.0-25568.0_1 |

  * Perform the following actions from "Demographic" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Age at Diagnosis |clear selection      |

## Cohort Builder - Date Card Functions

* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
  |filter_name      |
  |-----------------|
  |created_datetime |

* Enter text in a filter card from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |label                  |text      |
  |-----------------|-----------------------|----------|
  |Created Datetime |Set the since value    |1959-09-22|
  |Created Datetime |Set the through value  |11/30/95  |

* Check text displayed in the cohort query expression area
  |text      |
  |----------|
  |1959-09-22|
  |1995-11-30|

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |action               |
  |-----------------|---------------------|
  |Created Datetime |Remove the facet     |

* Pause "1" seconds

## Cohort Builder - String Card Functions

* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
  |filter_name      |
  |-----------------|
  |case_id |

* Enter text in a filter card from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |label                         |text                                   |
  |-----------------|------------------------------|---------------------------------------|
  |Case Id          |enter value to add filter     |9e15d908-12c2-5a1b-b1c4-c328242d474a   |

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name       |label                         |
  |-----------------|------------------------------|
  |Case Id          |add string value              |
