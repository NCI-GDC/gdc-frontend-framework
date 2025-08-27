# File Summary - BAM Metrics
Date Created        : 02/07/2025
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate BAM Metrics Table
Test-Case           : PEAR-474

tags: gdc-data-portal-v2, regression, file-summary

## Navigate to Summary Page: 93a3d4d5-a8ec-4a8b-8297-ee76c03ed3d7
* On GDC Data Portal V2 app
* Quick search for "93a3d4d5-a8ec-4a8b-8297-ee76c03ed3d7" and go to its page

## BAM Metrics Table - Left
* Verify the vertical table "Left Bam Metrics File Summary" header text is correct
    |expected_text                          |row  |
    |---------------------------------------|-----|
    |Total Reads                            |1    |
    |Average Insert Size                    |2    |
    |Average Read Length                    |3    |
    |Average Base Quality                   |4    |
    |Mean Coverage                          |5    |
    |Pairs On Diff Chr                      |6    |
    |Contamination                          |7    |
    |Contamination Error                    |8    |

* Verify the table "Left Bam Metrics File Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |493,306,926                            |1    |2      |
    |407                                    |2    |2      |
    |151                                    |3    |2      |
    |29                                     |4    |2      |
    |19.418071                              |5    |2      |
    |5,879,651                              |6    |2      |
    |0.000195635                            |7    |2      |
    |0.0000322                              |8    |2      |

## BAM Metrics Table - Right
* Verify the vertical table "Right Bam Metrics File Summary" header text is correct
    |expected_text                          |row  |
    |---------------------------------------|-----|
    |Proportion Reads Mapped                |1    |
    |Proportion Reads Duplicated            |2    |
    |Proportion Base Mismatch               |3    |
    |Proportion Targets No Coverage         |4    |
    |Proportion Coverage 10X                |5    |
    |Proportion Coverage 30X                |6    |
    |MSI Score                              |7    |
    |MSI Status                             |8    |

* Verify the table "Right Bam Metrics File Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |0.999357092                            |1    |2      |
    |0.078813848                            |2    |2      |
    |0.007591809                            |3    |2      |
    |--                                     |4    |2      |
    |0.907905                               |5    |2      |
    |0.096968                               |6    |2      |
    |0.017271157                            |7    |2      |
    |MSS                                    |8    |2      |

## Navigate to Summary Page: 50a7f1fb-35b7-4a6f-b0f2-6c328dcec39c
* Quick search for "50a7f1fb-35b7-4a6f-b0f2-6c328dcec39c" and go to its page

## BAM Metrics Table - Proportion Targets No Coverage
* Verify the table "Right Bam Metrics File Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |0.013839                               |4    |2      |
