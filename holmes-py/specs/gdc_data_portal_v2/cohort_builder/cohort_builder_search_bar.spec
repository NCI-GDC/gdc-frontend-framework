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

* Enter text in the search bar on the Cohort Builder page
  |text                   |
  |-----------------------|
  |Best Overall Response  |

* Validate search bar results on the Cohort Builder page
  |check_text             |
  |-----------------------|
  |Best Overall Response  |

* Click on the search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |Best Overall Response  |Best Overall Response  |

* Enter text in the search bar on the Cohort Builder page
  |text                   |
  |-----------------------|
  |expressed in number    |

* Validate search bar results on the Cohort Builder page
  |check_text             |
  |-----------------------|
  |Age at Diagnosis       |

* Click on the search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |Age at Diagnosis       |Age at Diagnosis       |

* Enter text in the search bar on the Cohort Builder page
  |text                   |
  |-----------------------|
  |GENIE-MSK              |

* Validate search bar results on the Cohort Builder page
  |check_text             |
  |-----------------------|
  |Project                |

* Click on the search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |Project                |Project                |

* Enter text in the search bar on the Cohort Builder page
  |text                   |
  |-----------------------|
  |age at index           |

* Validate search bar results on the Cohort Builder page
  |check_text                       |
  |---------------------------------|
  |cohort-builder-search-no-results |

* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
  |filter_name              |
  |-------------------------|
  |demographic.age_at_index |

* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort" from "Header" "section"

* Enter text in the search bar on the Cohort Builder page
  |text                   |
  |-----------------------|
  |age at index           |

* Validate search bar results on the Cohort Builder page
  |check_text             |
  |-----------------------|
  |age at index           |

* Click on the search bar result and validate the presence of correct facet card
  |text_to_click          |facet_to_check         |
  |-----------------------|-----------------------|
  |age at index           |Age at Index           |
