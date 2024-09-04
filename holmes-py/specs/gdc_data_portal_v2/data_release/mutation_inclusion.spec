# Data Release - Mutation Inclusion
Date Created        :
Version			    : 1.0
Owner		        : GDC QA
Description		    :
Test-Case           : PEAR-1932

tags: gdc-data-portal-v2, data-release

table: resources/data_release/mutation_inclusion.csv

## Mutation Affected in this Data Release: chr17:g.31327838C>T
* On GDC Data Portal V2 app
* Quick search for <DNA Change> and go to its page
* Verify the table "Summary Mutation Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Mutation UUID>   |
    |<DNA Change>                    |
    |<Type>              |
    |<Reference Genome Assembly>                                 |
    |<Functional Impact>                        |
* Verify the table "External References Mutation Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<dbSNP>                           |
    |<COSMIC>                             |
    |<CIViC>                            |
