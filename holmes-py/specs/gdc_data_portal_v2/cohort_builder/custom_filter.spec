# Cohort Builder - Custom Filter
Date Created    : 02/21/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - test custom filter tab and modal
Test-case       : PEAR-795

tags: gdc-data-portal-v2, cohort-builder, regression

## Navigate to Cohort Builder

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - Custom Filter Tab and Modal

* Click the "Custom Filters" tab on the Cohort Builder page

* Is text present on the page
  |text                     |
  |-------------------------|
  |No custom filters added  |

* Click button with data-testid
  |data_testid                                |
  |-------------------------------------------|
  |button-cohort-builder-add-a-custom-filter  |

* Enter text in the "Search for a case property" search bar
  |text               |
  |-------------------|
  |days_to_collection |

* Click button with data-testid
  |data_testid                        |
  |-----------------------------------|
  |button-samples.days_to_collection  |

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name         |action               |
  |-------------------|---------------------|
  |Days to Collection |Remove the facet     |

* Click button with data-testid
  |data_testid                                |
  |-------------------------------------------|
  |button-cohort-builder-add-a-custom-filter  |

* Enter text in the "Search for a case property" search bar
  |text                         |
  |-----------------------------|
  |serological laboratory test  |

* Click button with data-testid
  |data_testid                                    |
  |-----------------------------------------------|
  |button-follow_ups.viral_hepatitis_serologies   |

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name                 |action               |
  |---------------------------|---------------------|
  |Viral Hepatitis Serologies |Remove the facet     |

* Click button with data-testid
  |data_testid                                |
  |-------------------------------------------|
  |button-cohort-builder-add-a-custom-filter  |

* Click aria checkbox with spinner wait
  |aria_label                       |
  |---------------------------------|
  |show only properties with values |

* Is data testid not present on the page
  |data_testid                                                    |
  |---------------------------------------------------------------|
  |button-diagnoses.pathology_details.number_proliferating_cells  |

* Click button with data-testid
  |data_testid                                  |
  |---------------------------------------------|
  |button-diagnoses.annotations.classification  |

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name         |action               |
  |-------------------|---------------------|
  |Classification     |Remove the facet     |

* Is text present on the page
  |text                     |
  |-------------------------|
  |No custom filters added  |
