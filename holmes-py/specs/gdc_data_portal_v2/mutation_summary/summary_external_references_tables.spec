# Mutation Summary - Summary and External Reference Tables
Date Created    : 03/18/2025
Version			: 1.0
Owner		    : GDC QA
Description		: Validate Summary Table and External Reference Table
Test-Case       : PEAR-2367

tags: gdc-data-portal-v2, regression, mutation-summary

## Navigate to Mutation Summary Page: chr7:g.140753336A>T
* On GDC Data Portal V2 app
* Quick search for "chr7:g.140753336A>T" and go to its page

## Validate Table: Summary
* Verify the vertical table "Summary Mutation Summary" header text is correct
    |expected_text                          |row  |
    |---------------------------------------|-----|
    |UUID                                   |1    |
    |DNA Change                             |2    |
    |Type                                   |3    |
    |Reference Genome Assembly              |4    |
    |Allele In The Reference Assembly       |5    |
    |Functional Impact                      |6    |
* Verify the table "Summary Mutation Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |84aef48f-31e6-52e4-8e05-7d5b9ab15087   |1    |2      |
    |chr7:g.140753336A>T                    |2    |2      |
    |Single base substitution               |3    |2      |
    |GRCh38                                 |4    |2      |
    |A                                      |5    |2      |
    |ENST00000644969CVEP: MODERATESIFT: deleterious, score: 0PolyPhen: probably_damaging, score: 0.955|6    |2      |

## Validate Table: External References
* Verify the vertical table "External References Mutation Summary" header text is correct
    |expected_text                          |row  |
    |---------------------------------------|-----|
    |dbSNP                                  |1    |
    |COSMIC                                 |2    |
    |CIViC                                  |3    |
* Verify the table "External References Mutation Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |rs113488022                            |1    |2      |
    |COSM476                                |2    |2      |
    |12                                     |3    |2      |

* In table "External References Mutation Summary" these selections should take the user to correct page in a new tab
    |row  |column |expected_text                                                        |
    |-----|-------|---------------------------------------------------------------------|
    |1    |2      |All alleles are reported in the Forward orientation.                 |
    |2    |2      |In order to access COSMIC data                                       |
    |3    |2      |1                                                                    |
